import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBackward16 = forwardRef(
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
        <path d="M1 3.2c0-.11.09-.2.2-.2h1.6c.11 0 .2.09.2.2v9.6a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2zM9.356 7.848a.2.2 0 0 0 0 .304l5.315 4.56a.2.2 0 0 0 .33-.153V3.441a.2.2 0 0 0-.33-.152zM3.356 7.848a.2.2 0 0 0 0 .304l5.315 4.56a.2.2 0 0 0 .33-.153V3.441a.2.2 0 0 0-.33-.152z" />
      </g>
    </svg>
  )
);
IconBackward16.displayName = 'IconBackward16';
