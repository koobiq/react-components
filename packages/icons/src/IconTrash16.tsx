import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTrash16 = forwardRef(
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
        <path
          fillRule="evenodd"
          d="M13.5 13.6a1.4 1.4 0 0 1-1.4 1.4H3.9a1.4 1.4 0 0 1-1.4-1.4V5.2h11zM6 7a.2.2 0 0 0-.2.2v5.6c0 .11.09.2.2.2h.8a.2.2 0 0 0 .2-.2V7.2a.2.2 0 0 0-.2-.2zm3.2 0a.2.2 0 0 0-.2.2v5.6c0 .11.09.2.2.2h.8a.2.2 0 0 0 .2-.2V7.2A.2.2 0 0 0 10 7z"
          clipRule="evenodd"
        />
        <path d="M9.6 1A1.4 1.4 0 0 1 11 2.4h3.3a.2.2 0 0 1 .2.2v1.2a.2.2 0 0 1-.2.2H1.7a.2.2 0 0 1-.2-.2V2.6c0-.11.09-.2.2-.2H5A1.4 1.4 0 0 1 6.4 1z" />
      </g>
    </svg>
  )
);
IconTrash16.displayName = 'IconTrash16';
