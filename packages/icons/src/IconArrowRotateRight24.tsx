import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRotateRight24 = forwardRef(
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
        d="M6.27 17.728a8.1 8.1 0 1 1 11.455 0l-1.42-1.42a.3.3 0 0 0-.504.144l-1.361 5.9a.3.3 0 0 0 .36.36l5.899-1.362a.3.3 0 0 0 .144-.505l-.413-.412-1.008-1.008c4.1-4.1 4.1-10.75 0-14.85s-10.748-4.1-14.849 0c-4.1 4.1-4.1 10.75 0 14.85a10.46 10.46 0 0 0 6.147 2.997.294.294 0 0 0 .32-.225l.465-1.935a.152.152 0 0 0-.138-.186 8.07 8.07 0 0 1-5.097-2.348"
      />
    </svg>
  )
);
IconArrowRotateRight24.displayName = 'IconArrowRotateRight24';
