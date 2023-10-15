import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMagnifyingGlassMinus16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M9.05 7.35a.2.2 0 0 0 .2-.2v-.8a.2.2 0 0 0-.2-.2H4.5a.2.2 0 0 0-.2.2v.8c0 .11.09.2.2.2z" />
        <path d="M6.761 12.264c1.232 0 2.37-.404 3.286-1.088l3.516 3.515a.2.2 0 0 0 .283 0l.85-.85a.2.2 0 0 0 0-.282l-3.516-3.515a5.507 5.507 0 1 0-4.42 2.22m0-1.602a3.905 3.905 0 1 1 0-7.81 3.905 3.905 0 0 1 0 7.81" />
      </g>
    </svg>
  )
);
IconMagnifyingGlassMinus16.displayName = 'IconMagnifyingGlassMinus16';
