import { useEffect } from 'react';

import { Provider, ToastProvider, toast } from '@koobiq/react-components';
import type { Decorator } from '@storybook/react';

export const StoryThemeProvider: Decorator = (Story, context) => {
  const { viewMode, globals, parameters } = context;

  useEffect(() => {
    toast.closeAll();
  }, []);

  return (
    <Provider locale={globals.locale}>
      <div className="kbq-story-decorator">
        {viewMode === 'story' && !parameters.preventToastProvider && (
          <ToastProvider />
        )}
        <Story />
      </div>
    </Provider>
  );
};
