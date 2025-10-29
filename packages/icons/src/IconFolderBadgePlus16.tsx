import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderBadgePlus16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M1 3.2A1.2 1.2 0 0 1 2.2 2H5l1.8 1.8H1zM1 5h12.8A1.2 1.2 0 0 1 15 6.2v4.5h-.7V8a.2.2 0 0 0-.2-.2h-3.2a.2.2 0 0 0-.2.2v2.7H8a.2.2 0 0 0-.2.2V14H2.2A1.2 1.2 0 0 1 1 12.8z" />
        <path d="M16 12.9a.2.2 0 0 1-.2.2h-2.7v2.7a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2v-2.7H9.2a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2h2.7V9.2c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2v2.7h2.7c.11 0 .2.09.2.2z" />
      </g>
    </svg>
  )
);
IconFolderBadgePlus16.displayName = 'IconFolderBadgePlus16';
