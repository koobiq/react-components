import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRight16 = forwardRef(
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
        d="M11.998 8.786H1.2a.2.2 0 0 1-.201-.2V7.38c0-.11.09-.199.201-.199h10.797l-3.52-3.505a.2.2 0 0 1 0-.281l.856-.853a.2.2 0 0 1 .285 0l5.322 5.3a.2.2 0 0 1 0 .282l-5.322 5.3a.2.2 0 0 1-.285 0l-.856-.851a.2.2 0 0 1 0-.282z"
      />
    </svg>
  )
);
IconArrowRight16.displayName = 'IconArrowRight16';
