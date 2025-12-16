import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPaperPlane16 = forwardRef(
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
      <path d="M14.944 7.91 1.147 1.01a.101.101 0 0 0-.143.117l1.553 5.851c.021.081.09.14.174.15L10.87 8l-8.14.871a.2.2 0 0 0-.174.15l-1.553 5.852a.101.101 0 0 0 .143.116l13.797-6.898a.101.101 0 0 0 0-.182" />
    </svg>
  )
);
IconPaperPlane16.displayName = 'IconPaperPlane16';
