import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDoubleRight24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M10.17 12 3.087 4.787a.305.305 0 0 1 0-.427L4.333 3.09a.304.304 0 0 1 .434 0l8.538 8.696a.305.305 0 0 1 0 .426L4.767 20.91a.304.304 0 0 1-.434 0L3.087 19.64a.305.305 0 0 1 0-.427z" />
        <path d="m18.528 12-7.083-7.213a.305.305 0 0 1 0-.427L12.69 3.09a.304.304 0 0 1 .433 0l8.539 8.696a.305.305 0 0 1 0 .426l-8.539 8.696a.304.304 0 0 1-.433 0l-1.246-1.269a.305.305 0 0 1 0-.427z" />
      </g>
    </svg>
  )
);
IconChevronDoubleRight24.displayName = 'IconChevronDoubleRight24';
