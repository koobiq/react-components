import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmarkCircle16 = forwardRef(
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
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m-3.711-4.137L7.15 8 4.29 5.137a.2.2 0 0 1 0-.283l.565-.565a.2.2 0 0 1 .283 0L8 7.15l2.863-2.862a.2.2 0 0 1 .283 0l.565.565a.2.2 0 0 1 0 .283L8.85 8l2.862 2.863a.2.2 0 0 1 0 .283l-.565.565a.2.2 0 0 1-.283 0L8 8.85 5.137 11.71a.2.2 0 0 1-.283 0l-.565-.565a.2.2 0 0 1 0-.283"
      />
    </svg>
  )
);
IconXmarkCircle16.displayName = 'IconXmarkCircle16';
