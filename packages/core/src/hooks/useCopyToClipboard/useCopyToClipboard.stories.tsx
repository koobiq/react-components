import { useState } from 'react';

import type { Meta } from '@storybook/react';

import { useCopyToClipboard } from './index';

const meta = {
  title: 'Hooks/useCopyToClipboard',
} satisfies Meta<typeof useCopyToClipboard>;

export default meta;

export const Base = () => {
  const [value, setValue] = useState('Hello, clipboard!');
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    await copy(value);
  };

  const isCopied = copiedText === value;

  return (
    <div style={{ inlineSize: 320 }}>
      <label style={{ display: 'block', marginBlockEnd: 8 }}>
        <div style={{ marginBlockEnd: 4 }}>Text to copy:</div>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{ inlineSize: '100%' }}
        />
      </label>

      <button type="button" onClick={handleCopy}>
        {isCopied ? 'Copied!' : 'Copy'}
      </button>

      <p style={{ marginBlockStart: 8 }}>
        Last copied: {copiedText ?? 'nothing yet'}
      </p>
    </div>
  );
};
