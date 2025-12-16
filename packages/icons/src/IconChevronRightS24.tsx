import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronRightS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12.87 12 7.963 7.037a.3.3 0 0 1 0-.427L9.222 5.34a.31.31 0 0 1 .438 0l6.377 6.446a.3.3 0 0 1 0 .426L9.66 18.66a.31.31 0 0 1-.438 0L7.963 17.39a.3.3 0 0 1 0-.427z" />
    </svg>
  )
);
IconChevronRightS24.displayName = 'IconChevronRightS24';
