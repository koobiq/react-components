import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowsLeft16 = forwardRef(
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
        d="M1.059 5.406a.2.2 0 0 1 0-.284L5.367.81a.2.2 0 0 1 .285 0l.854.855a.2.2 0 0 1 0 .284l-2.508 2.51h10.8c.112 0 .202.09.202.201v1.21c0 .11-.09.2-.201.2H3.998L6.506 8.58a.2.2 0 0 1 0 .284l-.854.855a.2.2 0 0 1-.285 0zm13.94 4.726c0-.111-.09-.201-.2-.201H7.148l-1.61 1.61h9.26c.112 0 .202-.09.202-.2zm-11.001 1.41H5.48L2.797 8.855l-1.738 1.74a.2.2 0 0 0 0 .283l4.308 4.313a.2.2 0 0 0 .285 0l.854-.855a.2.2 0 0 0 0-.284z"
      />
    </svg>
  )
);
IconArrowsLeft16.displayName = 'IconArrowsLeft16';
