import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconRectangleCheckered16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M.2 2a.2.2 0 0 0-.2.2V4h3.8c.11 0 .2.09.2.2V8H0v5.8c0 .11.09.2.2.2h15.6a.2.2 0 0 0 .2-.2V12h-3.8a.2.2 0 0 1-.2-.2V8h4V2.2a.2.2 0 0 0-.2-.2zM8 8V4.2c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2V8zm0 0v3.8a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2V8z" />
    </svg>
  )
);
IconRectangleCheckered16.displayName = 'IconRectangleCheckered16';
