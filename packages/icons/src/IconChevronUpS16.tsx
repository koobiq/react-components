import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronUpS16 = forwardRef(
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
        d="M8 7.148 4.191 10.87a.203.203 0 0 1-.284 0l-.846-.83a.2.2 0 0 1 0-.29l4.797-4.692a.203.203 0 0 1 .284 0l4.797 4.693c.081.079.081.21 0 .289l-.845.83a.203.203 0 0 1-.285 0z"
      />
    </svg>
  )
);
IconChevronUpS16.displayName = 'IconChevronUpS16';
