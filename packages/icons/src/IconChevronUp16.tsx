import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronUp16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m8 6.67-4.809 4.771a.2.2 0 0 1-.284 0l-.846-.839a.206.206 0 0 1 0-.292L7.858 4.56a.2.2 0 0 1 .284 0l5.797 5.751c.081.08.081.212 0 .292l-.845.84a.2.2 0 0 1-.285 0z" />
    </svg>
  )
);
IconChevronUp16.displayName = 'IconChevronUp16';
