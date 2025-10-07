import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconUser24 = forwardRef(
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
        d="M12 12.75c2.485 0 4.5-3.1 4.5-6S14.485 1.5 12 1.5 7.5 3.85 7.5 6.75s2.015 6 4.5 6m0 1.8c1.912 0 3.447-1.112 4.464-2.421l4.924 2.954a1.8 1.8 0 0 1 .83 1.934l-1.166 5.248a.3.3 0 0 1-.293.235H3.241a.3.3 0 0 1-.293-.235l-1.166-5.248a1.8 1.8 0 0 1 .83-1.934l4.924-2.955c1.017 1.31 2.552 2.422 4.464 2.422"
      />
    </svg>
  )
);
IconUser24.displayName = 'IconUser24';
