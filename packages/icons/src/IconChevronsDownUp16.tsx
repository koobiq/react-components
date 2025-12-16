import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronsDownUp16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12.809.058 8 4.78 3.191.058a.203.203 0 0 0-.284 0l-.846.83c-.081.08-.081.21 0 .29L7.858 6.87a.203.203 0 0 0 .284 0l5.797-5.692c.081-.08.081-.21 0-.29l-.845-.83a.203.203 0 0 0-.285 0M3.191 15.942 8 11.22l4.809 4.722a.203.203 0 0 0 .285 0l.845-.83c.081-.08.081-.21 0-.29L8.142 9.13a.203.203 0 0 0-.284 0L2.06 14.822c-.081.08-.081.21 0 .29l.846.83a.203.203 0 0 0 .284 0" />
    </svg>
  )
);
IconChevronsDownUp16.displayName = 'IconChevronsDownUp16';
