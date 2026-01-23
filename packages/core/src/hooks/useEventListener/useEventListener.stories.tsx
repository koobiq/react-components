import { useState, useRef } from 'react';

import { useBoolean } from '../useBoolean';

import { useEventListener } from './index';

export default {
  title: 'Hooks/useEventListener',
  id: 'Hooks/useEventListener',
};

export const Example1 = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [active, { toggle }] = useBoolean(true);

  useEventListener({
    eventName: 'mousemove',
    handler: (event) => {
      const { clientX, clientY } = event;

      // update coordinates
      setCoords({ x: clientX, y: clientY });
    },
    active,
  });

  return (
    <>
      <p>
        Cursor position: ({coords.x}, {coords.y})
      </p>
      <label>
        Handler is active
        <input type="checkbox" onClick={toggle} defaultChecked />
      </label>
    </>
  );
};

Example1.storyName = 'Example 1';

export const Example2 = () => {
  const docRef = useRef<Document>(document);

  useEventListener({
    eventName: 'keydown',
    handler: (event) => {
      if (event.key !== 'Escape') return;

      // eslint-disable-next-line no-alert
      alert('Clicked ESC!');
    },
    element: docRef,
  });

  return <p>Press the ESC key</p>;
};

Example2.storyName = 'Example 2';

export const Example3 = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEventListener({
    eventName: 'click',
    handler: () => {
      // eslint-disable-next-line no-alert
      alert('Click!');
    },
    element: buttonRef,
  });

  return <button ref={buttonRef}>Click me</button>;
};

Example3.storyName = 'Example 3';

export const Example4 = () => {
  const docRef = useRef<Document>(document);

  useEventListener({
    eventName: 'hello',
    handler: (event) => {
      const e = event as CustomEvent<{ name: string }>;
      // eslint-disable-next-line no-alert
      alert(`Hello, ${e.detail.name}!`);
    },
    element: docRef,
  });

  return (
    <button
      onClick={() => {
        docRef.current.dispatchEvent(
          new CustomEvent('hello', {
            detail: { name: 'Sophia' },
          })
        );
      }}
    >
      Say hello!
    </button>
  );
};

Example4.storyName = 'Example 4';
