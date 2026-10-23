export const Modal = (props) => {
  if ('open' in props) {
    deprecate(
      'Modal: the "open" prop is deprecated. Use "isOpen" prop to replace it.'
    );
  }

  return null;
};
