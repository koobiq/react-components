import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import {
  Splitter,
  splitterPropAppearance,
  splitterPropOrientation,
} from './index.js';
import s from './Splitter.module.css';

const meta = {
  title: 'E2E/Splitter',
  component: Splitter,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Splitter>;

export default meta;

type Story = StoryObj<typeof Splitter>;

// React Aria sets hover and focus only on interaction, and the drag state only while dragging, so their classes are forced.
const states = [
  { title: 'default' },
  { title: 'hover', className: s.hovered },
  { title: 'focus', className: s.focusVisible },
  { title: 'active', className: s.active },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {splitterPropOrientation.flatMap((orientation) =>
        splitterPropAppearance.flatMap((appearance) =>
          states.map(({ title, className }) => (
            <Splitter
              key={`${orientation}-${appearance}-${title}`}
              orientation={orientation}
              appearance={appearance}
              style={{
                inlineSize: 64,
                blockSize: orientation === 'vertical' ? 64 : 48,
                border: '1px solid var(--kbq-line-contrast-less)',
                borderRadius: 'var(--kbq-size-border-radius)',
              }}
            >
              {['A', 'B'].map((label, index) => (
                <Splitter.Panel
                  key={label}
                  slotProps={
                    index === 0 ? { separator: { className } } : undefined
                  }
                >
                  <div
                    style={{
                      flex: 1,
                      display: 'grid',
                      placeItems: 'center',
                      userSelect: 'none',
                      color: 'var(--kbq-foreground-contrast-secondary)',
                    }}
                  >
                    {label}
                  </div>
                </Splitter.Panel>
              ))}
            </Splitter>
          ))
        )
      )}
    </E2eGrid>
  ),
};
