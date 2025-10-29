import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNorthStar16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M7.4 15a.2.2 0 0 1-.2-.2V9.836l-2.25 2.25a.2.2 0 0 1-.282 0l-.849-.848a.2.2 0 0 1 0-.283L5.974 8.8H1.2a.2.2 0 0 1-.2-.2V7.4c0-.11.09-.2.2-.2h4.964L3.819 4.856a.2.2 0 0 1 0-.283l.849-.849a.2.2 0 0 1 .282 0l2.25 2.25V1.2c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2v4.774l2.25-2.25a.2.2 0 0 1 .282 0l.849.849a.2.2 0 0 1 0 .283L9.836 7.2H14.8c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2h-4.774l2.155 2.155a.2.2 0 0 1 0 .283l-.849.848a.2.2 0 0 1-.282 0L8.8 9.836V14.8a.2.2 0 0 1-.2.2z" />
    </svg>
  )
);
IconNorthStar16.displayName = 'IconNorthStar16';
