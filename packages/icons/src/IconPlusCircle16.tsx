import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlusCircle16 = forwardRef(
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
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m.804-6.2v3a.2.2 0 0 1-.2.2h-1.2a.2.2 0 0 1-.2-.2v-3H4.132a.2.2 0 0 1-.2-.2V7.4c0-.11.09-.2.2-.2h3.072v-3c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2v3h2.928c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2z"
      />
    </svg>
  )
);
IconPlusCircle16.displayName = 'IconPlusCircle16';
