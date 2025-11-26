import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleXmarkS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m-.849-6L5.29 9.863a.2.2 0 0 0 0 .283l.565.566a.2.2 0 0 0 .283 0L8 8.849l1.863 1.863a.2.2 0 0 0 .283 0l.565-.566a.2.2 0 0 0 0-.283L8.848 8l1.863-1.862a.2.2 0 0 0 0-.283l-.565-.566a.2.2 0 0 0-.283 0L8 7.152 6.137 5.289a.2.2 0 0 0-.283 0l-.565.566a.2.2 0 0 0 0 .283z"
        clipRule="evenodd"
      />
    </svg>
  )
);
IconCircleXmarkS16.displayName = 'IconCircleXmarkS16';
