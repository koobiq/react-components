import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShield24 = forwardRef(
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
        d="M1.5 3.303c0-.996.806-1.803 1.8-1.803h17.4c.994 0 1.8.807 1.8 1.803v14.075a.3.3 0 0 1-.172.272l-10.2 6.321a.3.3 0 0 1-.256 0l-10.2-6.321a.3.3 0 0 1-.172-.272z"
      />
    </svg>
  )
);
IconShield24.displayName = 'IconShield24';
