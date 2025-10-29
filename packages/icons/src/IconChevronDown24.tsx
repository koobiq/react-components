import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDown24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m12 13.995 7.214-7.157a.3.3 0 0 1 .426 0l1.269 1.259a.31.31 0 0 1 0 .438l-8.696 8.627a.3.3 0 0 1-.426 0L3.09 8.535a.31.31 0 0 1 0-.438L4.36 6.838a.3.3 0 0 1 .427 0z" />
    </svg>
  )
);
IconChevronDown24.displayName = 'IconChevronDown24';
