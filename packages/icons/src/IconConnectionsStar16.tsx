import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconConnectionsStar16 = forwardRef(
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
      <path d="M5 3c0 .258-.049.505-.138.73L7.27 6.139a2 2 0 0 1 1.462 0l2.407-2.407a2 2 0 1 1 1.131 1.131L9.862 7.27a2 2 0 0 1 0 1.462l2.407 2.407a2 2 0 1 1-1.131 1.131L8.73 9.862a2 2 0 0 1-1.462 0L4.862 12.27a2 2 0 1 1-1.131-1.131L6.138 8.73a2 2 0 0 1 0-1.462L3.73 4.862A2 2 0 1 1 5 3" />
    </svg>
  )
);
IconConnectionsStar16.displayName = 'IconConnectionsStar16';
