import type { CSSProperties } from 'react';

import { spacing } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';
import type { Meta } from '@storybook/react';

import { useMediaQuery } from './useMediaQuery.js';

const meta = {
  title: 'Hooks/useMediaQuery',
} satisfies Meta<typeof useMediaQuery>;

export default meta;

export const Example = () => {
  const [isMatch] = useMediaQuery(['(max-width: 1024px)']);

  const background = isMatch
    ? 'var(--kbq-palette-cyan-40)'
    : 'var(--kbq-palette-blue-40)';

  const containerStyle: CSSProperties = {
    background,
    color: '#fff',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle} className={clsx(spacing({ p: 'xl' }))}>
      {`The viewport is ${isMatch ? 'less' : 'more'} than 1024px wide.`}
    </div>
  );
};
