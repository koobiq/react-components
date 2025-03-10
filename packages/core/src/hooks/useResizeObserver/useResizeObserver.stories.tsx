import { useResizeObserver } from './index';

export default {
  title: 'Hooks/useResizeObserver',
  id: 'Hooks/useResizeObserver',
};

export const Example = () => {
  const [ref, rect] = useResizeObserver();

  return (
    <div>
      <p>Resize the textarea by dragging its bottom-right corner.</p>
      <textarea readOnly ref={ref} />
      <p>{JSON.stringify(rect)}</p>
    </div>
  );
};

Example.storyName = 'Example';
