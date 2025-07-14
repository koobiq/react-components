import type { Meta } from '@storybook/react';

import { useBoolean } from './useBoolean.js';

const meta = {
  title: 'Hooks/useBoolean',
} satisfies Meta<typeof useBoolean>;

export default meta;

export const Example = () => {
  const [isChecked, { toggle }] = useBoolean(true);

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={toggle} />
      {isChecked ? 'Checked' : 'Unchecked'}
    </label>
  );
};
