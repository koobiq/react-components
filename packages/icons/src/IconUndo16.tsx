import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconUndo16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M4.063 7.366 6.697 10l-1.131 1.131L1 6.566 5.566 2l1.131 1.131-2.634 2.635H10.7c2.375 0 4.3 1.86 4.3 4.234 0 2.375-1.925 4-4.3 4H8v-1.6h2.7c1.491 0 2.7-.909 2.7-2.4s-1.209-2.634-2.7-2.634z" />
    </svg>
  )
);
IconUndo16.displayName = 'IconUndo16';
