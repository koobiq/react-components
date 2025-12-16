import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheckS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M13.69 5.441a.2.2 0 0 0 0-.282l-.849-.849a.2.2 0 0 0-.282 0L7 9.87 3.973 6.84a.2.2 0 0 0-.283 0l-.849.849a.2.2 0 0 0 0 .283L6.86 11.99a.2.2 0 0 0 .282 0z" />
    </svg>
  )
);
IconCheckS16.displayName = 'IconCheckS16';
