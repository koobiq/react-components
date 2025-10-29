import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconUndo24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M6.094 11.049 10.046 15l-1.697 1.697L1.5 9.85 8.349 3l1.697 1.697L6.094 8.65h9.956c3.562 0 6.45 2.789 6.45 6.351s-2.888 6-6.45 6H12v-2.4h4.05c2.237 0 4.05-1.363 4.05-3.6s-1.813-3.951-4.05-3.951z" />
    </svg>
  )
);
IconUndo24.displayName = 'IconUndo24';
