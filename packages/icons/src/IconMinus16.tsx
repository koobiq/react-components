import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinus16 = forwardRef(
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
      <path d="M14 8.6V7.4a.2.2 0 0 0-.2-.2H2.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2" />
    </svg>
  )
);
IconMinus16.displayName = 'IconMinus16';
