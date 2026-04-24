import { type ChangeEvent, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta } from '@storybook/react';

import { useInterval } from './useInterval';

const meta = {
  title: 'Hooks/useInterval',
} satisfies Meta<typeof useInterval>;

export default meta;

export const Base = () => {
  // The counter
  const [count, setCount] = useState<number>(0);
  // Dynamic delay
  const [delay, setDelay] = useState<number>(1000);
  // ON/OFF
  const [isPlaying, { toggle }] = useBoolean(false);

  useInterval(
    () => {
      // Your custom logic here
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(event.target.value));
  };

  return (
    <>
      <h1>{count}</h1>
      <button onClick={toggle}>{isPlaying ? 'pause' : 'play'}</button>
      <p>
        <label htmlFor="delay">Delay: </label>
        <input
          type="number"
          name="delay"
          onChange={handleChange}
          value={delay}
        />
      </p>
    </>
  );
};
