import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLocationArrowRight16 = forwardRef(
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
      <path d="M5.01 3.236a.14.14 0 0 1-.008-.06.204.204 0 0 1 .311-.144l7.59 4.793c.13.08.13.27 0 .35l-7.59 4.793a.204.204 0 0 1-.31-.145q-.004-.03.006-.06L6.5 8z" />
    </svg>
  )
);
IconLocationArrowRight16.displayName = 'IconLocationArrowRight16';
