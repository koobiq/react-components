import { Checkbox } from '@koobiq/react-components';
import type { Meta } from '@storybook/react';

import { useBoolean } from './useBoolean.js';

const meta = {
  title: 'Hooks/useBoolean',
} satisfies Meta<typeof useBoolean>;

export default meta;

export const Example = () => {
  /*
   * Before
   *
   * const [checked, setChecked] = useState(true);
   * const openChange = () => setChecked(checked);
   */

  // After
  const [checked, { toggle }] = useBoolean(true);

  return (
    <Checkbox checked={checked} onChange={toggle}>
      {checked ? 'Checked' : 'Unchecked'}
    </Checkbox>
  );
};
