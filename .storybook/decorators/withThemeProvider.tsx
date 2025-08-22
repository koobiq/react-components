import { Provider } from '@koobiq/react-components';
import type { Decorator } from '@storybook/react';

export const withThemeProvider: Decorator = (Story, context) => {
  const { locale } = context.globals;

  return (
    <Provider locale={locale}>
      <div className="kbq-story-decorator">
        <Story />
      </div>
    </Provider>
  );
};
