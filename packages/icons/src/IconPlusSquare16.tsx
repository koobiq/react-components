import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlusSquare16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.2 1A1.2 1.2 0 0 0 1 2.2v11.6A1.2 1.2 0 0 0 2.2 15h11.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 13.8 1zm5.26 10.943a.2.2 0 0 1-.06-.143V8.6H4.2a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2h3.2V4.2a.2.2 0 0 1 .2-.2h.8c.11 0 .2.09.2.2v3.2h3.2a.2.2 0 0 1 .2.2v.8a.2.2 0 0 1-.033.11.2.2 0 0 1-.167.09H8.6v3.2a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.14-.057"
      />
    </svg>
  )
);
IconPlusSquare16.displayName = 'IconPlusSquare16';
