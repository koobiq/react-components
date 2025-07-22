import { useLocale } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '../Typography';

import { Provider, type ProviderProps, useMatchedBreakpoints } from './index';

const meta = {
  title: 'Components/Provider',
  component: Provider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ProviderProps) => (
    <Provider {...args}>My application</Provider>
  ),
};

export const Breakpoints: Story = {
  render: function Render(args) {
    const App = () => {
      const breakpoints = useMatchedBreakpoints();

      return (
        <Typography variant="mono-normal-strong">
          Active breakpoints: {JSON.stringify(breakpoints)}
        </Typography>
      );
    };

    return (
      <Provider {...args}>
        <App />
      </Provider>
    );
  },
};

export const Localization: Story = {
  render: function Render() {
    const App = () => {
      const { locale } = useLocale();

      return (
        <Typography variant="mono-normal-strong">
          Current locale: {locale}
        </Typography>
      );
    };

    return (
      <Provider locale="en-US">
        <App />
      </Provider>
    );
  },
};
