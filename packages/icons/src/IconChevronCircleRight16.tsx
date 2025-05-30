import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronCircleRight16 = forwardRef(
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
        d="M15 8A7 7 0 1 0 1 8a7 7 0 0 0 14 0m-8.19 3.783-.566-.566a.2.2 0 0 1 0-.283L9.178 8 6.244 5.066a.2.2 0 0 1 0-.283l.565-.566a.2.2 0 0 1 .283 0l3.217 3.217.014.016.41.41a.2.2 0 0 1 0 .283l-.565.566-.015.013-3.06 3.06a.2.2 0 0 1-.284 0"
      />
    </svg>
  )
);
IconChevronCircleRight16.displayName = 'IconChevronCircleRight16';
