import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderO32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 25V5a2 2 0 0 1 2-2h9.735c.772 0 1.473.446 1.845 1.124C17.228 5.307 18.28 7 19 7h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2m2 0h24V13H5zm0-14h24V9H19c-1.43 0-2.684-1.675-3.392-2.858C15.205 5.466 14.493 5 13.705 5H5z"
      />
    </svg>
  )
);
IconFolderO32.displayName = 'IconFolderO32';
