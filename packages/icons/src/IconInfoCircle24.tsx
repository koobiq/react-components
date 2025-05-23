import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconInfoCircle24 = forwardRef(
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
        d="M12 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5m-1.258-5.753a.3.3 0 0 0 .3.3h1.899a.3.3 0 0 0 .3-.3V9.989a.3.3 0 0 0-.3-.3h-1.9a.3.3 0 0 0-.3.3zm-.094-9.486c0 .698.61 1.267 1.35 1.267.744 0 1.354-.569 1.354-1.267 0-.692-.61-1.261-1.355-1.261-.739 0-1.349.569-1.349 1.261"
      />
    </svg>
  )
);
IconInfoCircle24.displayName = 'IconInfoCircle24';
