import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderMultiple16 = forwardRef(
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
        <path d="M2.2 5A1.2 1.2 0 0 0 1 6.2v.6h5.8L5 5zM1 8v5.8A1.2 1.2 0 0 0 2.2 15h9.6a1.2 1.2 0 0 0 1.2-1.2V9.2A1.2 1.2 0 0 0 11.8 8zM3 2.2A1.2 1.2 0 0 1 4.2 1H7l1.8 1.8H3z" />
        <path d="M5.697 4H13.8A1.2 1.2 0 0 1 15 5.2v4.6a1.2 1.2 0 0 1-.8 1.132V9.2a2.4 2.4 0 0 0-2.4-2.4H8.497z" />
      </g>
    </svg>
  )
);
IconFolderMultiple16.displayName = 'IconFolderMultiple16';
