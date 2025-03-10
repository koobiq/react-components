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
        d="M12 1.5a5.4 5.4 0 0 0-5.4 5.4v3.6H4.8A1.8 1.8 0 0 0 3 12.3v8.4a1.8 1.8 0 0 0 1.8 1.8h14.4a1.8 1.8 0 0 0 1.8-1.8v-8.4a1.8 1.8 0 0 0-1.8-1.8h-1.8V6.9A5.4 5.4 0 0 0 12 1.5m3 9H9V6.9a3 3 0 0 1 6 0z"
      />
    </svg>
  )
);
IconLock24.displayName = 'IconLock24';
