import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmarkS16 = forwardRef(
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
        d="M12.441 4.694a.2.2 0 0 0 0-.284l-.85-.851a.2.2 0 0 0-.285 0L8 6.865 4.694 3.56a.2.2 0 0 0-.284 0l-.851.851a.2.2 0 0 0 0 .284L6.865 8 3.56 11.306a.2.2 0 0 0 0 .284l.851.851a.2.2 0 0 0 .284 0L8 9.135l3.306 3.306a.2.2 0 0 0 .284 0l.851-.85a.2.2 0 0 0 0-.285L9.135 8z"
      />
    </svg>
  )
);
IconXmarkS16.displayName = 'IconXmarkS16';
