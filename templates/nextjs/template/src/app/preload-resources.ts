'use client';

import ReactDOM from 'react-dom';

export function PreloadResources() {
  ReactDOM.preload('https://rsms.me/inter/inter.css', { as: 'font' });
  return null;
}
