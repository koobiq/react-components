import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronLeftS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="m11.13 12 4.907-4.963a.3.3 0 0 0 0-.427L14.778 5.34a.31.31 0 0 0-.438 0l-6.377 6.446a.3.3 0 0 0 0 .426l6.377 6.446c.12.121.318.121.438 0l1.259-1.269a.3.3 0 0 0 0-.427z"
      />
    </svg>
  )
);
IconChevronLeftS24.displayName = 'IconChevronLeftS24';
