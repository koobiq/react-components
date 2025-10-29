import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCloud24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12.093 19.5H5.414a5.414 5.414 0 0 1-.138-10.827 7.503 7.503 0 0 1 13.838.945 4.941 4.941 0 0 1-.055 9.882z" />
    </svg>
  )
);
IconCloud24.displayName = 'IconCloud24';
