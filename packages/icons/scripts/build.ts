import { promises as fsp } from 'fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import { transform } from '@svgr/core';

import { MANIFEST_FILE, OUTPUT_DIR, SIZES, INPUT_DIR } from '../constants';

type IconSize = (typeof SIZES)[number];

type IconsManifest = {
  icons: {
    name: string;
    size: IconSize;
    keywords?: string[];
    description?: string;
  }[];
};

function pascalCase(input: string): string {
  if (!input) return '';

  const tokens = input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean);

  return tokens
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .join('');
}

type IconMeta = {
  key: string;
  baseName: string;
  size?: IconSize;
  name: string;
};

function parseIconKey(key: string): IconMeta {
  const [baseName = '', rawSize] = key.split('_');

  const size = SIZES.includes(rawSize as IconSize)
    ? (rawSize as IconSize)
    : undefined;

  const name = `Icon${pascalCase(baseName)}${size || ''}`;

  return {
    key,
    baseName,
    size,
    name,
  };
}

// Stable order (by size first, then by name)
function compareBySizeAndName(
  a: { size?: IconSize; name: string },
  b: { size?: IconSize; name: string }
) {
  const sa = Number(a.size ?? 0);
  const sb = Number(b.size ?? 0);

  return sa === sb ? a.name.localeCompare(b.name) : sa - sb;
}

function buildEntryFile(entry: string, componentNames: string[]) {
  return `
${entry}

export type IconName = ${componentNames.join(' | ')};

export type IconsManifest = {
  icons: {
    name: IconName;
    size: '16' | '24' | '32' | '48' | '64';
    description?: string;
    keywords?: string[];
  }[];
};
`;
}

async function buildManifest(): Promise<IconsManifest> {
  try {
    const iconsInfo = JSON.parse(await fsp.readFile(MANIFEST_FILE, 'utf8'));

    const icons = Object.entries(iconsInfo).map(
      ([key, data]: [string, any]) => {
        const { size, name } = parseIconKey(key);
        const { description, tags } = data ?? {};

        return {
          name,
          size,
          description: description || undefined,
          keywords: Array.isArray(tags) ? tags : undefined,
        };
      }
    );

    icons.sort(compareBySizeAndName);

    console.log(
      `✅ Manifest built entirely from ${MANIFEST_FILE} (${icons.length} entries)`
    );

    return { icons } as IconsManifest;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to load ${MANIFEST_FILE}:`, msg);

    return { icons: [] };
  }
}

// SVGR template
function template(variables, { tpl }) {
  return tpl`
    import { forwardRef } from 'react';
    import type { SVGProps, Ref } from 'react';

    export const ${variables.componentName} = forwardRef((${variables.props}) => (
        ${variables.jsx}
    ));

    ${variables.componentName}.displayName = '${variables.componentName}';
`;
}

// SVGR config
const transformConfig = {
  template,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  ref: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'replace-values',
        fn: () => ({
          element: {
            enter: (node) => {
              if (node.name === 'svg') {
                // eslint-disable-next-line no-param-reassign
                node.attributes.fill = 'currentColor';
              } else if (node.attributes.fill) {
                // Existing fill → accent layer for duotone icons
                // eslint-disable-next-line no-param-reassign
                node.attributes.fill = 'var(--icon-accent-color, currentColor)';
              }
            },
          },
        }),
      },
    ],
  },
  typescript: true,
};

async function run() {
  // Clean OUTPUT_DIR, but keep legacy folder
  const entries = await fsp.readdir(OUTPUT_DIR).catch(() => []);

  await Promise.all(
    entries.map(async (entry) => {
      if (entry === 'legacy') return;

      const targetPath = path.join(OUTPUT_DIR, entry);
      await rm(targetPath, { recursive: true, force: true });
    })
  );

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Read manifest keys
  const iconsInfo = JSON.parse(await fsp.readFile(MANIFEST_FILE, 'utf8'));
  const metas: IconMeta[] = Object.keys(iconsInfo).map(parseIconKey);

  // stable sorted
  metas.sort(compareBySizeAndName);

  const results = await Promise.allSettled(
    metas.map(async (meta) => {
      const fileKey = `${meta.key}.svg`;
      const filePath = path.join(INPUT_DIR, fileKey);

      let svgCode: string;

      try {
        svgCode = await fsp.readFile(filePath, 'utf8');
      } catch {
        console.warn(`⚠️ Missing SVG: ${fileKey} (skipped)`);

        return;
      }

      const tsxCode = await transform(svgCode || '', transformConfig, {
        componentName: meta.name,
      });

      const outputPath = path.join(OUTPUT_DIR, `${meta.name}.tsx`);
      await fsp.writeFile(outputPath, tsxCode);
      console.log(`✅ ${fileKey} → ${meta.name}.tsx`);
    })
  );

  const failed = results.filter((r) => r.status === 'rejected').length;

  if (failed) {
    console.error(
      `❌ Copy completed with errors: ${failed}/${results.length} files`
    );
  }

  const entryPoints = metas.map((meta) => `export * from './${meta.name}';`);
  const names = metas.map((meta) => `'${meta.name}'`);

  // Write manifest.json
  const finalManifest = await buildManifest();
  await fsp.writeFile('manifest.json', JSON.stringify(finalManifest, null, 2));

  // Write src/index.ts
  const indexPath = path.join(OUTPUT_DIR, 'index.ts');

  await fsp.writeFile(indexPath, buildEntryFile(entryPoints.join('\n'), names));

  // Add export * from './legacy';
  const indexContent = await fsp.readFile(indexPath, 'utf8');

  if (!indexContent.includes(`export * from './legacy'`)) {
    await fsp.writeFile(
      indexPath,
      `${indexContent}\nexport * from './legacy';\n`
    );
  }

  console.log(`🎉 All SVGs successfully converted to React components!`);
}

run().catch((err) => {
  console.error('❌ Error while converting SVG:', err);
  process.exit(1);
});
