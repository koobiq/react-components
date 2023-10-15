import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRightS16 = forwardRef(
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
        d="M11.053 7.214 8.559 4.69a.2.2 0 0 1 0-.284l.839-.846c.08-.081.212-.081.292 0l4.251 4.297a.2.2 0 0 1 0 .284L9.69 12.44a.206.206 0 0 1-.292 0l-.84-.845a.2.2 0 0 1 0-.285l2.462-2.49H2.201a.2.2 0 0 1-.201-.2V7.414c0-.11.09-.2.201-.2z"
      />
    </svg>
  )
);
IconArrowRightS16.displayName = 'IconArrowRightS16';
