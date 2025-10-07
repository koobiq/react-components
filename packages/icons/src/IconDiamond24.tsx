import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDiamond24 = forwardRef(
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
        d="M.967 12.212a.3.3 0 0 1 0-.424L11.788.967a.3.3 0 0 1 .424 0l10.821 10.82a.3.3 0 0 1 0 .425l-10.82 10.82a.3.3 0 0 1-.425 0z"
      />
    </svg>
  )
);
IconDiamond24.displayName = 'IconDiamond24';
