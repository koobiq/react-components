import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconIp16 = forwardRef(
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
        d="M4.029 13.5a.2.2 0 0 0 .2-.2V2.7a.2.2 0 0 0-.2-.2H2.2a.2.2 0 0 0-.2.2v10.6c0 .11.09.2.2.2zm2.234-11a.2.2 0 0 0-.2.2v10.6c0 .11.09.2.2.2H8.09a.2.2 0 0 0 .2-.2V9.624h1.874C12.59 9.624 14 8.178 14 6.072 14 3.977 12.615 2.5 10.222 2.5zm3.542 5.338H8.29V4.322h1.504c1.286 0 1.91.7 1.91 1.75 0 1.045-.624 1.766-1.9 1.766"
      />
    </svg>
  )
);
IconIp16.displayName = 'IconIp16';
