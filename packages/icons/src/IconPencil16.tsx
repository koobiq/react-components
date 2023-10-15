import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPencil16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M12.391 1.351a1.2 1.2 0 0 0-1.696 0l-.857.857 3.954 3.954.857-.857a1.2 1.2 0 0 0 0-1.696zM12.944 7.01 8.99 3.056 2.636 9.411l3.953 3.953zM1.3 14.937a.2.2 0 0 1-.237-.237l.899-4.267 3.606 3.605z" />
      </g>
    </svg>
  )
);
IconPencil16.displayName = 'IconPencil16';
