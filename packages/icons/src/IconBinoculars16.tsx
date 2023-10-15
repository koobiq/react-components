import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBinoculars16 = forwardRef(
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
        <path d="M10.5 3.4H14V1.2a.2.2 0 0 0-.2-.2h-3.1a.2.2 0 0 0-.2.2zM14.141 4.6H10.5v9.6a.8.8 0 0 0 .8.8h3.744a.8.8 0 0 0 .788-.94zM9.3 9V4.6H6.7V9zM5.5 4.6H1.859l-1.69 9.46a.8.8 0 0 0 .787.94H4.7a.8.8 0 0 0 .8-.8zM5.3 1c.11 0 .2.09.2.2v2.2H2V1.2c0-.11.09-.2.2-.2z" />
      </g>
    </svg>
  )
);
IconBinoculars16.displayName = 'IconBinoculars16';
