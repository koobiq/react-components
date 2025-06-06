import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPaperclip16 = forwardRef(
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
        d="M8.731 1.718a3.3 3.3 0 0 1 4.667 4.667l-5.763 5.763a2.05 2.05 0 1 1-2.899-2.9L8.59 5.396 9.72 6.526 5.867 10.38a.45.45 0 1 0 .637.637l5.763-5.763A1.7 1.7 0 1 0 9.862 2.85L4.1 8.612a2.95 2.95 0 1 0 4.171 4.172l3.854-3.853 1.132 1.131-3.854 3.854A4.55 4.55 0 1 1 2.968 7.48z"
      />
    </svg>
  )
);
IconPaperclip16.displayName = 'IconPaperclip16';
