import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronLeft24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m10.005 12 7.157 7.214a.3.3 0 0 1 0 .426l-1.259 1.269a.31.31 0 0 1-.438 0l-8.627-8.696a.3.3 0 0 1 0-.426l8.627-8.696a.31.31 0 0 1 .438 0l1.259 1.269a.3.3 0 0 1 0 .427z" />
    </svg>
  )
);
IconChevronLeft24.displayName = 'IconChevronLeft24';
