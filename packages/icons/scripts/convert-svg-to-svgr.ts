import fs from 'fs';
import path from 'path';

import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import { pascalCase } from '@figma-export/utils';
import { transform } from '@svgr/core';

// Settings
const inputDir = path.resolve('temp'); // SVG input
const outputDir = path.resolve('src'); // TSX output

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Template (same as figmaExport)
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

// SVGO pipeline (same as figmaExport)
const svgoTransform = transformSvgWithSvgo({
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    { name: 'removeComments' },
    { name: 'removeXMLNS' },
    { name: 'cleanupIds' },
    { name: 'removeEmptyContainers' },
    {
      name: 'removeAttrs',
      params: {
        attrs: 'stroke|transform',
      },
    },
    {
      name: 'replace-values',
      fn: () => ({
        element: {
          enter: (node) => {
            if (node.name === 'svg') {
              // eslint-disable-next-line no-param-reassign
              node.attributes.fill = 'currentColor';
            } else if (node.attributes.fill) {
              // eslint-disable-next-line no-param-reassign
              node.attributes.fill = 'currentColor';
            }

            // eslint-disable-next-line no-param-reassign
            if (node.attributes.color) delete node.attributes.color;
            // eslint-disable-next-line no-param-reassign
            if (node.attributes.class) delete node.attributes.class;
          },
        },
      }),
    },
  ],
});

async function run() {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.svg'));

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const filePath = path.join(inputDir, file);
      const svgCode = fs.readFileSync(filePath, 'utf8');

      const baseName = path.basename(file, '.svg');
      const componentName = `Icon${pascalCase(baseName)}`;

      const optimizedSvg = (await svgoTransform(svgCode)) as string;

      const tsxCode = await transform(
        optimizedSvg,
        {
          template,
          plugins: [
            '@svgr/plugin-svgo',
            '@svgr/plugin-jsx',
            '@svgr/plugin-prettier',
          ],
          svgo: false, // already optimized above
          typescript: true,
          ref: true,
        },
        { componentName }
      );

      const outputPath = path.join(outputDir, `${componentName}.tsx`);
      fs.writeFileSync(outputPath, tsxCode);
      console.log(`✅ ${file} → ${componentName}.tsx`);
    })
  );

  const failed = results.filter((r) => r.status === 'rejected').length;

  if (failed) {
    console.warn(
      `Copy completed with errors: ${failed}/${results.length} files`
    );
  }

  console.log(
    `🎉 All SVGs from ${inputDir}/ successfully converted to React components!`
  );
}

run().catch((err) => {
  console.error(`❌ Error while converting SVG:`, err);

  process.exit(1);
});
