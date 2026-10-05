export const Input = (props) => {
  if ('disabled' in props) {
    deprecate(
      'Input: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  if ('readonly' in props) {
    deprecate(
      'Input: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
    );
  }

  return null;
};
