import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from './index.js';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: {
    'Tabs.Tab': Tabs.Tab,
    'Tabs.Panel': Tabs.Panel,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Base: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="History of Ancient Rome" {...args}>
        <Tabs.Tab key="FoR" title="Founding of Rome">
          Arma virumque cano, Troiae qui primus ab oris.
        </Tabs.Tab>
        <Tabs.Tab key="MaR" title="Monarchy and Republic">
          Senatus Populusque Romanus.
        </Tabs.Tab>
        <Tabs.Tab key="Emp" title="Empire">
          Alea jacta est.
        </Tabs.Tab>
      </Tabs>
    );
  },
};
