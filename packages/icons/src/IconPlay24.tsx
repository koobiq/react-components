import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlay24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M19.359 11.758a.278.278 0 0 1 0 .484l-12.92 7.967c-.193.113-.439-.022-.439-.242V4.033c0-.22.246-.355.44-.242z"
      />
    </svg>
  )
);
IconPlay24.displayName = 'IconPlay24';
