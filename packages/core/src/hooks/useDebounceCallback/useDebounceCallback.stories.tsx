import React, { useState, useEffect } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta } from '@storybook/react';

import { useDebounceCallback } from './index';

const meta = {
  title: 'Hooks/useDebounceCallback',
} satisfies Meta<typeof useDebounceCallback>;

export default meta;

export const Base = () => {
  const [value, setValue] = useState('');
  const [active, setActive] = useBoolean(true);
  const [firstCall, setFirstCall] = useBoolean(false);
  const [searchString, setSearchString] = useState(value);

  const [debouncedSetSearchString] = useDebounceCallback({
    callback: setSearchString,
    options: {
      firstCallWithoutDelay: firstCall,
    },
  });

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (active) debouncedSetSearchString(value);
    else setSearchString(value);
  }, [value, active]);

  return (
    <div>
      <section>
        <label>
          <input
            defaultChecked={active}
            type="checkbox"
            onClick={setActive.toggle}
          />
          Enable delay
        </label>
      </section>
      <section>
        <label>
          <input
            type="checkbox"
            defaultChecked={firstCall}
            onClick={setFirstCall.toggle}
          />
          Enable instant first call
        </label>
      </section>
      <input placeholder="Search query" value={value} onChange={handler} />
      <div>Query result: {searchString}</div>
    </div>
  );
};
