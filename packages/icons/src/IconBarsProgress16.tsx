import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsProgress16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M1 3.2A1.2 1.2 0 0 1 2.2 2h11.6A1.2 1.2 0 0 1 15 3.2v.933a1.2 1.2 0 0 1-1.2 1.2H2.2a1.2 1.2 0 0 1-1.2-1.2zm0 4.333a1.2 1.2 0 0 1 1.2-1.2h11.6a1.2 1.2 0 0 1 1.2 1.2v.934a1.2 1.2 0 0 1-1.2 1.2H2.2a1.2 1.2 0 0 1-1.2-1.2zm0 4.334a1.2 1.2 0 0 1 1.2-1.2h11.6a1.2 1.2 0 0 1 1.2 1.2v.933a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 12.8zM5.86 3.07a.2.2 0 0 0-.2.2v.8c0 .11.09.2.2.2h7.6a.2.2 0 0 0 .2-.2v-.8a.2.2 0 0 0-.2-.2zm4 4.337a.2.2 0 0 0-.2.2v.8c0 .11.09.2.2.2h3.6a.2.2 0 0 0 .2-.2v-.8a.2.2 0 0 0-.2-.2zm-6.2 4.533v.8c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2v-.8a.2.2 0 0 0-.2-.2h-9.6a.2.2 0 0 0-.2.2" />
    </svg>
  )
);
IconBarsProgress16.displayName = 'IconBarsProgress16';
