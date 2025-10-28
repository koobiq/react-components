import { promises as fsp } from 'fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import { transform } from '@svgr/core';

import { ICONS_INFO_FILE, OUTPUT_DIR, SIZES, TEMP_DIR } from '../constants';

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
    const iconsInfo = JSON.parse(await fsp.readFile(ICONS_INFO_FILE, 'utf8'));

    const icons = Object.entries(iconsInfo).map(
      ([key, data]: [string, any]) => {
        const [baseName = '', rawSize] = key.split('_');

        const size = SIZES.includes(rawSize as IconSize)
          ? (rawSize as IconSize)
          : undefined;

        const name = `Icon${pascalCase(baseName)}${size || ''}`;
        const { description, tags } = data ?? {};

        return { name, size, description, keywords: tags };
      }
    );

    // Stable order (by size first, then by name)
    icons.sort((a, b) => {
      const sa = Number(a.size ?? 0);
      const sb = Number(b.size ?? 0);

      return sa === sb ? String(a.name).localeCompare(String(b.name)) : sa - sb;
    });

    console.log(
      `✅ Manifest built entirely from ${ICONS_INFO_FILE} (${icons.length} entries)`
    );

    return { icons } as IconsManifest;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to load ${ICONS_INFO_FILE}:`, msg);

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
  // Prepare filesystem: create output directory
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Read manifest keys
  const iconsInfo = JSON.parse(await fsp.readFile(ICONS_INFO_FILE, 'utf8'));
  const keys = Object.keys(iconsInfo);

  // Build list of expected SVGs based on keys, e.g. "server-badge-linux_16" → "server-badge-linux_16.svg"
  const files = keys.map((key) => `${key}.svg`);

  const entryPoints: string[] = [];
  const names: string[] = [];

  const results = await Promise.allSettled(
    files.map(async (fileKey) => {
      const filePath = path.join(TEMP_DIR, fileKey);

      // read SVG source
      let svgCode: string;

      try {
        svgCode = await fsp.readFile(filePath, 'utf8');
      } catch {
        console.warn(`⚠️ Missing SVG: ${fileKey} (skipped)`);

        return;
      }

      const baseName = path.basename(fileKey, '.svg');
      const name = `Icon${pascalCase(baseName)}`;

      const tsxCode = await transform(svgCode || '', transformConfig, {
        componentName: name,
      });

      const outputPath = path.join(OUTPUT_DIR, `${name}.tsx`);
      await fsp.writeFile(outputPath, tsxCode);
      console.log(`✅ ${fileKey} → ${name}.tsx`);

      entryPoints.push(`export * from './${name}';`);
      names.push(`'${name}'`);
    })
  );

  const failed = results.filter((r) => r.status === 'rejected').length;

  if (failed) {
    console.error(
      `❌ Copy completed with errors: ${failed}/${results.length} files`
    );
  }

  // write manifest.json
  const finalManifest = await buildManifest();
  await fsp.writeFile('manifest.json', JSON.stringify(finalManifest, null, 2));

  // write src/index.ts
  await fsp.writeFile(
    path.join(OUTPUT_DIR, 'index.ts'),
    buildEntryFile(entryPoints.join('\n'), names)
  );

  await rm(TEMP_DIR, { recursive: true, force: true });
  console.log(`🎉 All SVGs successfully converted to React components!`);
}

run().catch((err) => {
  console.error('❌ Error while converting SVG:', err);
  process.exit(1);
});
