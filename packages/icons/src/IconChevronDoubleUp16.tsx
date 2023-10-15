import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDoubleUp16 = forwardRef(
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
        <path d="m8 9.22-4.809 4.722a.203.203 0 0 1-.284 0l-.846-.83a.2.2 0 0 1 0-.29L7.858 7.13a.203.203 0 0 1 .284 0l5.797 5.692c.081.08.081.21 0 .29l-.845.83a.203.203 0 0 1-.285 0z" />
        <path d="M8 3.648 3.191 8.37a.203.203 0 0 1-.284 0l-.846-.83a.2.2 0 0 1 0-.29l5.797-5.692a.203.203 0 0 1 .284 0l5.797 5.693c.081.079.081.21 0 .289l-.845.83a.203.203 0 0 1-.285 0z" />
      </g>
    </svg>
  )
);
IconChevronDoubleUp16.displayName = 'IconChevronDoubleUp16';
