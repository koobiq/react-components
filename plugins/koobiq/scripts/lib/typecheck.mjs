// T3 (--typecheck): asks the TypeScript language service for deprecation
// suggestions (6385/6387) and keeps those whose symbol is declared in a
// @koobiq/* package. It complements the catalog, which only sees JSX on
// Koobiq bindings: TypeScript also follows product wrappers typed with Koobiq
// props, aliases, destructuring and property access. It does not report
// object-literal keys or spreads, and only sees what the d.ts marks
// @deprecated.
import fs from 'node:fs';
import path from 'node:path';

const SCRIPT_RE = /\.(?:[cm]?[jt]sx?)$/;
const DEFAULT_MAX_FILES = 200;
const DEFAULT_TIMEOUT_MS = 60000;

const isFile = (file) => {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
};

const findTsconfig = (fromDir, root) => {
  let dir = fromDir;

  for (;;) {
    const candidate = path.join(dir, 'tsconfig.json');

    if (isFile(candidate)) return candidate;
    if (path.resolve(dir) === path.resolve(root)) return null;

    const parent = path.dirname(dir);

    if (parent === dir) return null;
    dir = parent;
  }
};

const normalize = (file) =>
  path.resolve(file).split(path.sep).join('/').toLowerCase();

const parseConfig = (ts, file) => {
  const read = ts.readConfigFile(file, ts.sys.readFile);

  return ts.parseJsonConfigFileContent(
    read.config || {},
    ts.sys,
    path.dirname(file)
  );
};

/** Compiler options for a group; resolves solution-style configs. */
const optionsFor = (ts, configFile, files) => {
  const fallback = {
    allowJs: true,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution:
      ts.ModuleResolutionKind.Bundler ?? ts.ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    strict: true,
  };

  if (!configFile) return fallback;

  try {
    let parsed = parseConfig(ts, configFile);

    if (parsed.fileNames.length === 0 && parsed.projectReferences?.length) {
      const wanted = new Set(files.map(normalize));

      const candidates = parsed.projectReferences
        .map((ref) => {
          const target = isFile(ref.path)
            ? ref.path
            : path.join(ref.path, 'tsconfig.json');

          return isFile(target) ? parseConfig(ts, target) : null;
        })
        .filter(Boolean);

      parsed =
        candidates.find((c) =>
          c.fileNames.some((f) => wanted.has(normalize(f)))
        ) ||
        candidates.find((c) => c.options.jsx) ||
        candidates[0] ||
        parsed;
    }

    return { ...fallback, ...parsed.options };
  } catch {
    return fallback;
  }
};

const nodeAt = (ts, sourceFile, position) => {
  let found = sourceFile;

  const visit = (node) => {
    if (position >= node.getStart(sourceFile) && position < node.getEnd()) {
      found = node;
      ts.forEachChild(node, visit);
    }
  };

  ts.forEachChild(sourceFile, visit);

  return found;
};

const deprecatedText = (symbol) => {
  try {
    const tag = symbol.getJsDocTags().find((t) => t.name === 'deprecated');

    return (
      tag?.text
        ?.map((part) => part.text)
        .join('')
        .trim() || ''
    );
  } catch {
    return '';
  }
};

const REPLACEMENT_RE = /Use "([\w$-]+)"/;

const MEMBER_PARENTS = [
  'JsxAttribute',
  'PropertyAssignment',
  'ShorthandPropertyAssignment',
  'PropertyAccessExpression',
  'BindingElement',
];

/** The type that owns the member named at `node`, when it is known. */
const ownerType = (ts, checker, node) => {
  const { parent } = node;

  try {
    if (ts.isJsxAttribute(parent))
      return checker.getContextualType(parent.parent);
    if (ts.isPropertyAccessExpression(parent))
      return checker.getTypeAtLocation(parent.expression);
    if (ts.isBindingElement(parent))
      return checker.getTypeAtLocation(parent.parent);
    if (
      ts.isPropertyAssignment(parent) ||
      ts.isShorthandPropertyAssignment(parent)
    )
      return checker.getContextualType(parent.parent);
  } catch {
    // no owner type
  }

  return null;
};

const propertiesOf = (checker, type) => {
  const apparent = checker.getApparentType(type);
  const parts = apparent.isUnion() ? apparent.types : [apparent];

  return parts.flatMap((part) => checker.getPropertiesOfType(part));
};

/**
 * The declared symbol behind `node`. A JSX attribute or a destructured name
 * resolves to a symbol in the product file, so members are looked up on the
 * owner type; other references follow import aliases.
 */
const declaredSymbol = (ts, checker, node, owner) => {
  if (owner) {
    const name = node.text ?? node.getText();

    const member = propertiesOf(checker, owner).find(
      (p) => p.getName() === name
    );

    if (member) return member;
  }

  const symbol = checker.getSymbolAtLocation(node);

  return symbol && symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
};

/**
 * JSDoc sometimes names a replacement that does not exist ("isReadonly" for
 * "isReadOnly"): keep it only when the owner type has it, fix the casing when
 * that is the only difference, otherwise drop it.
 */
const verifyReplacement = (checker, owner, text) => {
  const match = REPLACEMENT_RE.exec(text);

  if (!match || !owner) return text;

  const names = propertiesOf(checker, owner).map((p) => p.getName());

  if (names.includes(match[1])) return text;

  const cased = names.find((n) => n.toLowerCase() === match[1].toLowerCase());

  if (cased) return text.replace(match[0], `Use "${cased}"`);

  return `${text.slice(0, match.index).trim()} The replacement it names ("${match[1]}") does not exist in the installed version; check the component docs.`;
};

/**
 * Runs the language service over `files` (absolute paths) grouped by their
 * tsconfig. Returns findings with absolute file paths and offsets.
 */
export function runTypecheck({
  ts,
  root,
  files,
  isKoobiqFile,
  maxFiles = DEFAULT_MAX_FILES,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  const started = Date.now();
  const findings = [];
  const skipped = [];

  const targets = files.filter(
    (f) => SCRIPT_RE.test(f) && !f.endsWith('.d.ts')
  );

  if (targets.length > maxFiles) {
    skipped.push({
      check: 'typecheck',
      reason: `checked the first ${maxFiles} of ${targets.length} files`,
    });
  }

  const groups = new Map();

  for (const file of targets.slice(0, maxFiles)) {
    const config = findTsconfig(path.dirname(file), root) || '';

    if (!groups.has(config)) groups.set(config, []);
    groups.get(config).push(file);
  }

  for (const [config, groupFiles] of groups) {
    if (Date.now() - started > timeoutMs) {
      skipped.push({
        check: 'typecheck',
        reason: `stopped after ${timeoutMs / 1000} s`,
      });

      break;
    }

    const options = {
      ...optionsFor(ts, config || null, groupFiles),
      noEmit: true,
      skipLibCheck: true,
      incremental: false,
      composite: false,
      declaration: false,
      plugins: undefined,
    };

    const snapshots = new Map();

    const host = {
      getScriptFileNames: () => groupFiles,
      getScriptVersion: () => '1',
      getScriptSnapshot: (file) => {
        if (!snapshots.has(file)) {
          const text = ts.sys.readFile(file);

          snapshots.set(
            file,
            text == null ? undefined : ts.ScriptSnapshot.fromString(text)
          );
        }

        return snapshots.get(file);
      },
      getCurrentDirectory: () => root,
      getCompilationSettings: () => options,
      getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
      directoryExists: ts.sys.directoryExists,
      getDirectories: ts.sys.getDirectories,
      realpath: ts.sys.realpath,
      useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
    };

    const service = ts.createLanguageService(host, ts.createDocumentRegistry());

    try {
      const program = service.getProgram();
      const checker = program.getTypeChecker();

      for (const file of groupFiles) {
        if (Date.now() - started > timeoutMs) break;

        const sourceFile = program.getSourceFile(file);

        if (!sourceFile) continue;

        for (const diagnostic of service.getSuggestionDiagnostics(file)) {
          if (!diagnostic.reportsDeprecated || diagnostic.start == null)
            continue;

          const node = nodeAt(ts, sourceFile, diagnostic.start);

          const isMember = MEMBER_PARENTS.some(
            (kind) => node.parent?.kind === ts.SyntaxKind[kind]
          );

          const owner = isMember ? ownerType(ts, checker, node) : null;
          const symbol = declaredSymbol(ts, checker, node, owner);

          if (
            !symbol?.declarations?.some((d) =>
              isKoobiqFile(d.getSourceFile().fileName)
            )
          )
            continue;

          const name = symbol.getName();

          const id = isMember
            ? 'deprecated/prop'
            : /^[A-Z]/.test(name) && symbol.flags & ts.SymbolFlags.Value
              ? 'deprecated/component'
              : 'deprecated/export';

          const text = deprecatedText(symbol);

          const reason =
            text && isMember ? verifyReplacement(checker, owner, text) : text;

          findings.push({
            id,
            file,
            offset: diagnostic.start,
            message: ts.flattenDiagnosticMessageText(
              diagnostic.messageText,
              ' '
            ),
            ...(reason && { suggestion: reason }),
            source: 'ts',
            confidence: 'high',
          });
        }
      }
    } catch (error) {
      skipped.push({
        check: 'typecheck',
        reason: `language service failed: ${String(error?.message || error).slice(0, 120)}`,
      });
    } finally {
      service.dispose();
    }
  }

  return { findings, skipped, durationMs: Date.now() - started };
}
