import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderBadgeArrowRight16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={17}
      fill="currentColor"
      viewBox="0 0 16 17"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M1 3.2A1.2 1.2 0 0 1 2.2 2H5l1.8 1.8H1zM15.729 13.246a.2.2 0 0 1 0 .339l-3.823 2.389a.2.2 0 0 1-.306-.17v-1.589H8.2a.2.2 0 0 1-.2-.2v-1.2c0-.11.09-.2.2-.2h3.4v-1.59a.2.2 0 0 1 .306-.169z" />
        <path d="M1 5v7.8A1.2 1.2 0 0 0 2.2 14h4.6v-2.385c0-.11.09-.2.2-.2h3.4V8.962a.2.2 0 0 1 .306-.17L15 11.348V6.2A1.2 1.2 0 0 0 13.8 5z" />
      </g>
    </svg>
  )
);
IconFolderBadgeArrowRight16.displayName = 'IconFolderBadgeArrowRight16';
