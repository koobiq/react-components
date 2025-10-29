import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBentoMenu32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M10 22v4H6v-4zm8 0v4h-4v-4zm8 0v4h-4v-4zm-16-8v4H6v-4zm8 0v4h-4v-4zm8 0v4h-4v-4zM10 6v4H6V6zm8 0v4h-4V6zm8 0v4h-4V6z" />
    </svg>
  )
);
IconBentoMenu32.displayName = 'IconBentoMenu32';
