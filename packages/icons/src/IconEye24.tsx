import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEye24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M12 15.408A3.41 3.41 0 0 0 15.416 12 3.41 3.41 0 0 0 12 8.593 3.41 3.41 0 0 0 8.584 12 3.41 3.41 0 0 0 12 15.408" />
        <path d="M.099 12.224a.3.3 0 0 1 0-.447L5.883 6.5a9.065 9.065 0 0 1 12.234 0l5.784 5.277a.3.3 0 0 1 0 .447L18.117 17.5a9.065 9.065 0 0 1-12.234 0zM17.694 12c0-3.136-2.55-5.68-5.694-5.68S6.306 8.865 6.306 12c0 3.137 2.55 5.68 5.694 5.68s5.694-2.543 5.694-5.68" />
      </g>
    </svg>
  )
);
IconEye24.displayName = 'IconEye24';
