import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinusSquare16 = forwardRef(
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
        d="M2.2 1A1.2 1.2 0 0 0 1 2.2v11.6A1.2 1.2 0 0 0 2.2 15h11.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 13.8 1zm9.6 7.6H4.2a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2h7.6a.2.2 0 0 1 .2.2v.8a.2.2 0 0 1-.2.2"
      />
    </svg>
  )
);
IconMinusSquare16.displayName = 'IconMinusSquare16';
