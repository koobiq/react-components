import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLocationArrowUp16 = forwardRef(
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
        d="M12.764 10.99q.03.01.06.008a.204.204 0 0 0 .144-.31L8.175 3.095a.208.208 0 0 0-.35 0l-4.793 7.591c-.08.128 0 .29.144.31q.03.004.06-.006L8 9.5z"
      />
    </svg>
  )
);
IconLocationArrowUp16.displayName = 'IconLocationArrowUp16';
