import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAsterisk16 = forwardRef(
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
        d="M7.2 14.8c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2V9.931l3.443 3.443a.2.2 0 0 0 .282 0l.849-.849a.2.2 0 0 0 0-.282L9.931 8.8H14.8a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2H9.931l3.443-3.443a.2.2 0 0 0 0-.282l-.849-.849a.2.2 0 0 0-.282 0L8.8 6.069V1.2a.2.2 0 0 0-.2-.2H7.4a.2.2 0 0 0-.2.2v4.869L3.757 2.626a.2.2 0 0 0-.282 0l-.849.849a.2.2 0 0 0 0 .282L6.069 7.2H1.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h4.869l-3.443 3.443a.2.2 0 0 0 0 .282l.849.849a.2.2 0 0 0 .282 0L7.2 9.931z"
      />
    </svg>
  )
);
IconAsterisk16.displayName = 'IconAsterisk16';
