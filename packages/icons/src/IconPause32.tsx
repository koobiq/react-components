import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPause32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.75 6h-2.5C9.56 6 9 6.448 9 7v18c0 .552.56 1 1.25 1h2.5c.69 0 1.25-.448 1.25-1V7c0-.552-.56-1-1.25-1m9 0h-2.5C18.56 6 18 6.448 18 7v18c0 .552.56 1 1.25 1h2.5c.69 0 1.25-.448 1.25-1V7c0-.552-.56-1-1.25-1"
      />
    </svg>
  )
);
IconPause32.displayName = 'IconPause32';
