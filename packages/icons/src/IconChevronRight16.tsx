import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronRight16 = forwardRef(
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
        d="M9.33 8 4.559 3.191a.2.2 0 0 1 0-.284l.839-.846c.08-.081.212-.081.292 0l5.751 5.797a.2.2 0 0 1 0 .284L5.69 13.94a.206.206 0 0 1-.292 0l-.84-.845a.2.2 0 0 1 0-.285z"
      />
    </svg>
  )
);
IconChevronRight16.displayName = 'IconChevronRight16';
