import { deprecate } from '@koobiq/logger';

export const Button = (props) => {
  if (process.env.NODE_ENV !== 'production' && 'progress' in props) {
    deprecate(
      'Button: the "progress" prop is deprecated. Use "isLoading" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Button: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  return null;
};
