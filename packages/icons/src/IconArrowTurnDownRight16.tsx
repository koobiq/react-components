import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowTurnDownRight16 = forwardRef(
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
        d="M3.612 2.2A.2.2 0 0 0 3.41 2H2.201A.2.2 0 0 0 2 2.2v8.412c0 .11.09.2.201.2H11l-2.511 2.496a.2.2 0 0 0 0 .284l.854.85a.2.2 0 0 0 .285 0l4.314-4.29a.2.2 0 0 0 0-.283L9.627 5.581a.2.2 0 0 0-.285 0l-.854.85a.2.2 0 0 0 0 .283l2.51 2.496H3.613z"
      />
    </svg>
  )
);
IconArrowTurnDownRight16.displayName = 'IconArrowTurnDownRight16';
