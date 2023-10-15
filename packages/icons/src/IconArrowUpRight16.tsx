import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpRight16 = forwardRef(
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
        d="M10.247 4.612H5.27a.2.2 0 0 1-.201-.201V3.2c0-.11.09-.201.201-.201h7.53c.11 0 .201.09.201.202v7.529c0 .111-.09.201-.201.201h-1.21a.2.2 0 0 1-.201-.201V5.752l-7.639 7.639a.2.2 0 0 1-.285 0l-.855-.855a.2.2 0 0 1 0-.285z"
      />
    </svg>
  )
);
IconArrowUpRight16.displayName = 'IconArrowUpRight16';
