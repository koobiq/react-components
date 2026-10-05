export const Link = (props) => {
  if ('visitable' in props) {
    deprecate(
      'Link: the "visitable" prop is deprecated. Use "allowVisited" prop to replace it.'
    );
  }

  return null;
};
