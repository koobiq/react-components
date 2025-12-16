import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowDownRight16 = forwardRef(
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
      <path d="M10.247 11.388H5.27a.2.2 0 0 0-.201.201v1.21c0 .11.09.201.201.201h7.53c.11 0 .201-.09.201-.202V5.27a.2.2 0 0 0-.201-.201h-1.21a.2.2 0 0 0-.201.201v4.979L3.749 2.609a.2.2 0 0 0-.285 0l-.855.855a.2.2 0 0 0 0 .285z" />
    </svg>
  )
);
IconArrowDownRight16.displayName = 'IconArrowDownRight16';
