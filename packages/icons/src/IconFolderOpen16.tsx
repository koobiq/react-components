import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderOpen16 = forwardRef(
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
        <path d="M2.2 2A1.2 1.2 0 0 0 1 3.2v9.6A1.2 1.2 0 0 0 2.2 14h.032l3.061-6.887A1.2 1.2 0 0 1 6.39 6.4H15V5.2A1.2 1.2 0 0 0 13.8 4H8L6 2z" />
        <path d="m3.546 14 2.791-6.281A.2.2 0 0 1 6.52 7.6h9.172a.2.2 0 0 1 .183.281l-2.399 5.406A1.2 1.2 0 0 1 12.38 14z" />
      </g>
    </svg>
  )
);
IconFolderOpen16.displayName = 'IconFolderOpen16';
