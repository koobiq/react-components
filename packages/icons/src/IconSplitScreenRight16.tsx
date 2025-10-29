import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenRight16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M15 12.8a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 12.8V3.2A1.2 1.2 0 0 1 2.2 2h11.6A1.2 1.2 0 0 1 15 3.2zm-5.2-.4a.2.2 0 0 0 .2-.2V3.8a.2.2 0 0 0-.2-.2h-7a.2.2 0 0 0-.2.2v8.4c0 .11.09.2.2.2z" />
    </svg>
  )
);
IconSplitScreenRight16.displayName = 'IconSplitScreenRight16';
