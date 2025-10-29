import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDoubleLeft16 = forwardRef(
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
        <path d="m9.22 8 4.722 4.809a.203.203 0 0 1 0 .285l-.83.845c-.08.081-.21.081-.29 0L7.13 8.142a.203.203 0 0 1 0-.284l5.692-5.797c.08-.081.21-.081.29 0l.83.846a.203.203 0 0 1 0 .284z" />
        <path d="m3.648 8 4.722 4.809a.203.203 0 0 1 0 .285l-.83.845c-.08.081-.21.081-.29 0L1.559 8.142a.203.203 0 0 1 0-.284L7.251 2.06c.079-.081.21-.081.289 0l.83.846a.203.203 0 0 1 0 .284z" />
      </g>
    </svg>
  )
);
IconChevronDoubleLeft16.displayName = 'IconChevronDoubleLeft16';
