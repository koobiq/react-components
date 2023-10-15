import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRotateLeft24 = forwardRef(
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
        d="M17.725 17.744a8.1 8.1 0 1 0-11.455 0l1.42-1.42a.3.3 0 0 1 .504.145l1.362 5.9a.3.3 0 0 1-.36.359l-5.9-1.361a.3.3 0 0 1-.144-.505l.414-.412 1.007-1.008c-4.1-4.1-4.1-10.75 0-14.85s10.749-4.1 14.85 0 4.1 10.749 0 14.85a10.46 10.46 0 0 1-6.147 2.997.294.294 0 0 1-.32-.225l-.465-1.935a.153.153 0 0 1 .137-.187 8.07 8.07 0 0 0 5.097-2.348"
      />
    </svg>
  )
);
IconArrowRotateLeft24.displayName = 'IconArrowRotateLeft24';