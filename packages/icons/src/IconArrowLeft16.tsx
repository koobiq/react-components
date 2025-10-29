import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowLeft16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m4.084 8.786 3.52 3.505a.2.2 0 0 1 0 .281l-.856.853a.2.2 0 0 1-.285 0l-5.322-5.3a.2.2 0 0 1 0-.282l5.322-5.3a.2.2 0 0 1 .285 0l.856.852a.2.2 0 0 1 0 .28l-3.52 3.506h10.797a.2.2 0 0 1 .201.2v1.206a.2.2 0 0 1-.201.199z" />
    </svg>
  )
);
IconArrowLeft16.displayName = 'IconArrowLeft16';
