import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLocationArrowRight24 = forwardRef(
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
        d="M7.514 4.854a.2.2 0 0 1-.01-.09.306.306 0 0 1 .465-.216l11.387 7.19a.312.312 0 0 1 0 .525l-11.387 7.19a.306.306 0 0 1-.466-.218.2.2 0 0 1 .01-.09L9.75 12z"
      />
    </svg>
  )
);
IconLocationArrowRight24.displayName = 'IconLocationArrowRight24';
