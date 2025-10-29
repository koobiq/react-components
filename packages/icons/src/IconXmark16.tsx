import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmark16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M13.441 3.694a.2.2 0 0 0 0-.284l-.85-.851a.2.2 0 0 0-.285 0L8 6.865 3.694 2.56a.2.2 0 0 0-.284 0l-.851.85a.2.2 0 0 0 0 .285L6.865 8 2.56 12.306a.2.2 0 0 0 0 .284l.85.851a.2.2 0 0 0 .285 0L8 9.135l4.306 4.306a.2.2 0 0 0 .284 0l.851-.85a.2.2 0 0 0 0-.285L9.135 8z" />
    </svg>
  )
);
IconXmark16.displayName = 'IconXmark16';
