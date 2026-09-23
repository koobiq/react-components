import type { Meta, StoryObj } from '@storybook/react';
import { AR as AR1x1, KZ as KZ1x1 } from 'country-flag-icons/react/1x1';
import { AR, KZ } from 'country-flag-icons/react/3x2';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Flag, flagPropShape } from './index.js';

const meta = {
  title: 'E2E/Flag',
  component: Flag,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Flag>;

export default meta;

type Story = StoryObj<typeof Flag>;

// A circle takes square graphics: an inline SVG is fitted into the box, not cropped.
const graphics = {
  rectangle: [AR, KZ],
  circle: [AR1x1, KZ1x1],
};

export const Shape: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {flagPropShape.flatMap((shape) =>
        [false, true].flatMap((hideShadow) =>
          graphics[shape].map((Graphic, index) => (
            <Flag
              key={`${shape}-${hideShadow}-${index}`}
              shape={shape}
              hideShadow={hideShadow}
              size={32}
            >
              <Graphic />
            </Flag>
          ))
        )
      )}
      {flagPropShape.map((shape) => (
        <Flag key={shape} shape={shape} size={32} />
      ))}
    </E2eGrid>
  ),
};
