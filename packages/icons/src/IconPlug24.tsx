import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlug24 = forwardRef(
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
        d="M15.198 1.59a.3.3 0 0 1 .424 0l1.273 1.273a.3.3 0 0 1 0 .424l-2.97 2.97 3.818 3.818 2.97-2.97a.3.3 0 0 1 .424 0l1.273 1.273a.3.3 0 0 1 0 .424l-2.97 2.97 1.485 1.485a.3.3 0 0 1 0 .424l-3.622 3.622a7.5 7.5 0 0 1-7.411 1.896l-2.135 2.134-1.697-1.697-2.782 2.782a.3.3 0 0 1-.424 0l-1.273-1.273a.3.3 0 0 1 0-.424l2.782-2.782-1.697-1.697 2.135-2.134a7.5 7.5 0 0 1 1.896-7.412l3.621-3.621a.3.3 0 0 1 .425 0l1.485 1.485zm-4.259 11.47a1.5 1.5 0 1 0 2.122-2.12 1.5 1.5 0 0 0-2.122 2.12"
      />
    </svg>
  )
);
IconPlug24.displayName = 'IconPlug24';
