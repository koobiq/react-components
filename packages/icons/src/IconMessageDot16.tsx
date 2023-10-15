import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMessageDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.093 1.396A2.01 2.01 0 0 1 14 0a2 2 0 1 1-1.907 1.396"
      />
      <path
        fill="currentColor"
        d="M3.4 2h7.4A3.2 3.2 0 0 0 15 5.04v5.56a2.4 2.4 0 0 1-2.4 2.4H7.75l-3.425 2.74A.2.2 0 0 1 4 15.584V13h-.6A2.4 2.4 0 0 1 1 10.6V4.4A2.4 2.4 0 0 1 3.4 2M8 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4-1a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
      />
    </svg>
  )
);
IconMessageDot16.displayName = 'IconMessageDot16';
