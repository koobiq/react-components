import type { Meta } from '@storybook/react';

import { useRefs } from './useRefs';

const meta = {
  title: 'Hooks/useRefs',
} satisfies Meta<typeof useRefs>;

export default meta;

export const Example = () => {
  const buttons = ['first', 'second', 'third'];
  const refs = useRefs<HTMLLIElement>(buttons.length);

  return (
    <ul>
      {buttons.map((name, index) => (
        <li ref={refs[index]} key={index}>
          {name}
        </li>
      ))}
    </ul>
  );
};
