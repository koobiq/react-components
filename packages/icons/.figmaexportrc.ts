import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import asSvgr from '@figma-export/output-components-as-svgr';
import { pascalCase } from '@figma-export/utils';
import type { FigmaExportRC } from '@figma-export/types';

import * as dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();

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

const componentOptions = {
  token: process.env.FIGMA_TOKEN,
  fileId: config.figmaFile.id,
  concurrency: 5,
  onlyFromPages: [config.figmaFile.page],
  transformers: [
    transformSvgWithSvgo({
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
          fn: () => {
            return {
              element: {
                enter: (node) => {
                  if (node.name === 'svg') {
                    node.attributes['fill'] = 'currentColor';
                  } else if (node.attributes['fill']) {
                    node.attributes['fill'] = 'currentColor';
                  }
                  if (node.attributes['color']) {
                    delete node.attributes['color'];
                  }

                  if (node.attributes['class']) {
                    delete node.attributes['class'];
                  }
                },
              },
            };
          },
        },
      ],
    }),
  ],
  outputters: [
    asSvgr({
      output: config.output.tempSvg,
      getComponentName: (options) => `Icon${pascalCase(options.basename)}`,
      getFileExtension: () => '.tsx',
      getSvgrConfig: () => ({
        template,
        plugins: [
          '@svgr/plugin-svgo',
          '@svgr/plugin-jsx',
          '@svgr/plugin-prettier',
        ],
        svgo: false,
        typescript: true,
        ref: true,
      }),
    }),
  ],
};

const figmaExport: FigmaExportRC = {
  commands: [['components', componentOptions]],
};

export default figmaExport;
