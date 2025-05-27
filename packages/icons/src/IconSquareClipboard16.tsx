import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquareClipboard16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M7.7 0a1.2 1.2 0 0 0-1.2 1.2V2H5.2A1.2 1.2 0 0 0 4 3.2v.6h8A1.2 1.2 0 0 1 13.2 5v9.4h.6a1.2 1.2 0 0 0 1.2-1.2v-10A1.2 1.2 0 0 0 13.8 2h-1.3v-.8A1.2 1.2 0 0 0 11.3 0z" />
        <path d="M1 14.8A1.2 1.2 0 0 0 2.2 16h8.6a1.2 1.2 0 0 0 1.2-1.2V6.2A1.2 1.2 0 0 0 10.8 5H2.2A1.2 1.2 0 0 0 1 6.2zm1.8-.4a.2.2 0 0 1-.2-.2V6.8c0-.11.09-.2.2-.2h7.4c.11 0 .2.09.2.2v7.4a.2.2 0 0 1-.2.2z" />
      </g>
    </svg>
  )
);
IconSquareClipboard16.displayName = 'IconSquareClipboard16';
