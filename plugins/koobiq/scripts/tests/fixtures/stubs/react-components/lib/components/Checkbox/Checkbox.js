export const Checkbox = (props) => {
  if ('checked' in props) {
    deprecate(
      'Checkbox: the "checked" prop is deprecated. Use "isSelected" prop to replace it.'
    );
  }

  if ('readonly' in props) {
    deprecate(
      'Checkbox: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
    );
  }

  return null;
};
