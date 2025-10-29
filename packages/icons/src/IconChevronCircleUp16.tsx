import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronCircleUp16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m3.783 8.19-.566.566a.2.2 0 0 1-.283 0L8 6.822 5.066 9.756a.2.2 0 0 1-.283 0l-.566-.565a.2.2 0 0 1 0-.283L7.434 5.69l.016-.014.41-.41a.2.2 0 0 1 .283 0l.566.565.013.015 3.06 3.06a.2.2 0 0 1 0 .284" />
    </svg>
  )
);
IconChevronCircleUp16.displayName = 'IconChevronCircleUp16';
