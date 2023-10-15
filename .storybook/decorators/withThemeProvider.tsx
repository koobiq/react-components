import { Provider } from '@koobiq/react-components';
import type { Decorator } from '@storybook/react';

export const withThemeProvider: Decorator = (Story) => (
  <Provider>
    <div className="kbq-story-decorator">
      <Story />
    </div>
  </Provider>
);
