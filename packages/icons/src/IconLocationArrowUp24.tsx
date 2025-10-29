import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLocationArrowUp24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M19.146 16.486q.044.016.09.01a.306.306 0 0 0 .216-.465l-7.19-11.387a.312.312 0 0 0-.525 0l-7.19 11.387a.306.306 0 0 0 .218.466c.03.004.06-.002.09-.01L12 14.25z" />
    </svg>
  )
);
IconLocationArrowUp24.displayName = 'IconLocationArrowUp24';
