import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconForward16 = forwardRef(
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
        <path d="M15 3.2a.2.2 0 0 0-.2-.2h-1.6a.2.2 0 0 0-.2.2v9.6c0 .11.09.2.2.2h1.6a.2.2 0 0 0 .2-.2zM6.645 7.848a.2.2 0 0 1 0 .304l-5.315 4.56a.2.2 0 0 1-.33-.153V3.441a.2.2 0 0 1 .33-.152zM12.645 7.848a.2.2 0 0 1 0 .304l-5.315 4.56a.2.2 0 0 1-.33-.153V3.441a.2.2 0 0 1 .33-.152z" />
      </g>
    </svg>
  )
);
IconForward16.displayName = 'IconForward16';
