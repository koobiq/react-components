import type { Meta } from '@storybook/react';

import { useResizeObserver } from './index';

const meta = {
  title: 'Hooks/useResizeObserver',
} satisfies Meta<typeof useResizeObserver>;

export default meta;

export const Base = () => {
  const [ref, rect] = useResizeObserver();

  return (
    <div>
      <p>Resize the textarea by dragging its bottom-right corner.</p>
      <textarea readOnly ref={ref} />
      <p>{JSON.stringify(rect)}</p>
    </div>
  );
};
