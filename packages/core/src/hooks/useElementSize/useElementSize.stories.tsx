import type { Meta } from '@storybook/react';

import { useElementSize } from './useElementSize';

const meta = {
  title: 'Hooks/useElementSize',
} satisfies Meta<typeof useElementSize>;

export default meta;

export const Base = () => {
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
