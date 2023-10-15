import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLock24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M6 10.5v-3a6 6 0 1 1 12 0v3h1.2a1.8 1.8 0 0 1 1.8 1.8v8.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 20.7v-8.4a1.8 1.8 0 0 1 1.8-1.8zm2.4 0h7.2v-3a3.6 3.6 0 0 0-7.2 0zm4.075 5.923a1.5 1.5 0 1 0-.95 0l-.96 2.88a.15.15 0 0 0 .143.197h2.584a.15.15 0 0 0 .142-.197z"
      />
    </svg>
  )
);
IconLock24.displayName = 'IconLock24';
