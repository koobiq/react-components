import { useElementSize } from './useElementSize';

export default {
  title: 'Hooks/useElementSize',
  id: 'Hooks/useElementSize',
};

export const Example = () => {
  const { ref, width, height } = useElementSize();

  return (
    <div>
      <p>Resize the textarea by dragging its bottom-right corner.</p>
      <textarea readOnly ref={ref} />
      <p>
        width: {width}px, height: {height}px
      </p>
    </div>
  );
};

Example.storyName = 'Example';
