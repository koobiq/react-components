import * as path from 'node:path';

import type { ExtractorResult, IConfigFile } from '@microsoft/api-extractor';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { JsonFile, PackageJsonLookup } from '@rushstack/node-core-library';
import chalk from 'chalk';

const { red, green } = chalk;

type PackageEntry = { dir: string; report: string };
type BuildConfig = { components: string[]; packages: PackageEntry[] };

const cfg = JsonFile.load('tools/api-extractor/config.json') as BuildConfig;

const arg = process.argv[2];

let localBuild = true;
let components = cfg.components;
let packages = cfg.packages;

if (arg === 'onlyCheck') {
  localBuild = false;
} else if (arg) {
  components = cfg.components.filter((c) => c === arg);
  packages = cfg.packages.filter((p) => p.report === arg);

  if (components.length === 0 && packages.length === 0) {
    console.error(`Unknown target "${arg}".`);
    console.error(`Known components: ${cfg.components.join(', ')}`);
    console.error(
      `Known packages: ${cfg.packages.map((p) => p.report).join(', ')}`
    );
    process.exit(1);
  }
}

const configObjectFullPath = path.resolve(
  'tools/api-extractor/api-extractor.json'
);
const packageJsonFullPath =
  new PackageJsonLookup().tryGetPackageJsonFilePathFor(configObjectFullPath);
const repoRoot = path.resolve('.');

let hasErrors = false;

function runForComponent(name: string): ExtractorResult {
  const configObject: IConfigFile =
    ExtractorConfig.loadFile(configObjectFullPath);

  configObject.projectFolder = repoRoot;
  configObject.mainEntryPointFilePath = `<projectFolder>/packages/components/dist/components/${name}/index.d.ts`;
  configObject.apiReport!.reportFolder =
    '<projectFolder>/tools/public_api_guard/components';
  configObject.apiReport!.reportFileName = `${name}.api.md`;

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    configObjectFullPath,
    packageJsonFullPath,
  });

  return Extractor.invoke(extractorConfig, {
    localBuild,
    showVerboseMessages: true,
    showDiagnostics: process.env.AE_DIAG === '1',
  });
}

function runForPackage({ dir, report }: PackageEntry): ExtractorResult {
  const configObject: IConfigFile =
    ExtractorConfig.loadFile(configObjectFullPath);

  configObject.projectFolder = repoRoot;
  configObject.mainEntryPointFilePath = `<projectFolder>/packages/${dir}/dist/index.d.ts`;
  configObject.apiReport!.reportFolder =
    '<projectFolder>/tools/public_api_guard';
  configObject.apiReport!.reportFileName = `${report}.api.md`;

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    configObjectFullPath,
    packageJsonFullPath,
  });

  return Extractor.invoke(extractorConfig, {
    localBuild,
    showVerboseMessages: true,
    showDiagnostics: process.env.AE_DIAG === '1',
  });
}

function handle(label: string, result: ExtractorResult): void {
  if (result.succeeded) {
    console.error(green(`API Extractor completed successfully: ${label}`));
  } else if (result.errorCount > 0) {
    console.error(
      red(`API Extractor completed with ${result.errorCount} errors`)
    );
    hasErrors = true;
  } else if (result.apiReportChanged) {
    process.exit(1);
  }
}

for (const name of components) {
  try {
    handle(name, runForComponent(name));
  } catch (e) {
    console.error(`API Extractor: ${name} — crashed: ${(e as Error).message}`);
    if (process.env.AE_DIAG === '1') console.error((e as Error).stack);
    hasErrors = true;
  }
}

for (const pkg of packages) {
  try {
    handle(pkg.report, runForPackage(pkg));
  } catch (e) {
    console.error(
      `API Extractor: ${pkg.report} — crashed: ${(e as Error).message}`
    );
    if (process.env.AE_DIAG === '1') console.error((e as Error).stack);
    hasErrors = true;
  }
}

process.exitCode = hasErrors ? 1 : 0;
