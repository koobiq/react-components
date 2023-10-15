import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBookMultiple24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M17 2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2V2z" />
        <path d="M6 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm5 0v6.59a.5.5 0 0 0 .888.314L14 10.3l2.112 2.604A.5.5 0 0 0 17 12.59V6z" />
      </g>
    </svg>
  )
);
IconBookMultiple24.displayName = 'IconBookMultiple24';
