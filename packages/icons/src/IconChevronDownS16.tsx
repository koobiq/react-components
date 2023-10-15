import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDownS16 = forwardRef(
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
        d="m8 8.85 3.809-3.722a.203.203 0 0 1 .285 0l.845.83c.081.08.081.21 0 .29L8.142 10.94a.203.203 0 0 1-.284 0L3.06 6.248a.2.2 0 0 1 0-.29l.846-.83a.203.203 0 0 1 .284 0z"
      />
    </svg>
  )
);
IconChevronDownS16.displayName = 'IconChevronDownS16';
