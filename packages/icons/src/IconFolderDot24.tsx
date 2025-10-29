import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderDot24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <circle
        cx={21}
        cy={6}
        r={3}
        fill="var(--icon-accent-color, currentColor)"
      />
      <g>
        <path d="M16.439 7.5H1.5v11.7A1.8 1.8 0 0 0 3.3 21h17.4a1.8 1.8 0 0 0 1.8-1.8v-8.64a4.802 4.802 0 0 1-6.061-3.06M1.5 4.8A1.8 1.8 0 0 1 3.3 3h4.2l2.7 2.7H1.5z" />
      </g>
    </svg>
  )
);
IconFolderDot24.displayName = 'IconFolderDot24';
