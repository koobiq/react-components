import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconText24 = forwardRef(
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
        d="M13.755 21.45V4.887h6.195a.3.3 0 0 0 .3-.3V2.55a.3.3 0 0 0-.3-.3H4.05a.3.3 0 0 0-.3.3v2.037a.3.3 0 0 0 .3.3h6.422V21.45a.3.3 0 0 0 .3.3h2.683a.3.3 0 0 0 .3-.3"
      />
    </svg>
  )
);
IconText24.displayName = 'IconText24';
