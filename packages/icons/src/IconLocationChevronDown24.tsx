import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLocationChevronDown24 = forwardRef(
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
        d="M4.854 7.514a.2.2 0 0 0-.09-.01.306.306 0 0 0-.216.465l7.19 11.387a.312.312 0 0 0 .525 0l7.19-11.387a.306.306 0 0 0-.218-.466.2.2 0 0 0-.09.01L12 9.75z"
      />
    </svg>
  )
);
IconLocationChevronDown24.displayName = 'IconLocationChevronDown24';
