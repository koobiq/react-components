import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowDownLeft16 = forwardRef(
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
        d="M5.753 11.388h4.978c.111 0 .201.09.201.201v1.21c0 .11-.09.201-.201.201H3.2A.2.2 0 0 1 3 12.798V5.27c0-.111.09-.201.202-.201H4.41c.111 0 .201.09.201.201v4.979l7.639-7.639a.2.2 0 0 1 .285 0l.855.855a.2.2 0 0 1 0 .285z"
      />
    </svg>
  )
);
IconArrowDownLeft16.displayName = 'IconArrowDownLeft16';
