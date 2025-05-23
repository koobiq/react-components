import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmarkCircle24 = forwardRef(
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
        d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5m-5.567-6.206L10.727 12 6.433 7.706a.3.3 0 0 1 0-.425l.848-.848a.3.3 0 0 1 .425 0L12 10.727l4.294-4.294a.3.3 0 0 1 .425 0l.848.848a.3.3 0 0 1 0 .425L13.273 12l4.294 4.294a.3.3 0 0 1 0 .425l-.848.848a.3.3 0 0 1-.425 0L12 13.273l-4.294 4.294a.3.3 0 0 1-.425 0l-.848-.848a.3.3 0 0 1 0-.425"
      />
    </svg>
  )
);
IconXmarkCircle24.displayName = 'IconXmarkCircle24';
