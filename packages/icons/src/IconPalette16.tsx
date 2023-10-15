import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPalette16 = forwardRef(
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
        d="M8 14.8c0 .11-.09.2-.2.197A7 7 0 1 1 15 8a3.5 3.5 0 0 1-3.5 3.5c-3.378 0-3.496 1.46-3.5 3.3m1.962-9.876a.962.962 0 1 0 0-1.924.962.962 0 0 0 0 1.924m-3.038-.962a.962.962 0 1 0-1.924 0 .962.962 0 0 0 1.924 0M3.531 8.141a.962.962 0 1 0 0-1.925.962.962 0 0 0 0 1.925m9.818-.963a.962.962 0 1 0-1.924 0 .962.962 0 0 0 1.924 0m-8.673 4.817a.962.962 0 1 0 0-1.924.962.962 0 0 0 0 1.924"
      />
    </svg>
  )
);
IconPalette16.displayName = 'IconPalette16';
