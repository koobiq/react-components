import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const Icon3Columns16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M13.8 1A1.2 1.2 0 0 1 15 2.2v11.6a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 13.8V2.2A1.2 1.2 0 0 1 2.2 1zM6.73 13.4h2.54V2.6H6.73zm4.14 0h2.33a.2.2 0 0 0 .2-.2V2.8a.2.2 0 0 0-.2-.2h-2.33zM2.8 2.6a.2.2 0 0 0-.2.2v10.4c0 .11.09.2.2.2h2.33V2.6z" />
    </svg>
  )
);
Icon3Columns16.displayName = 'Icon3Columns16';
