import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDiamondHalf24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M4.15 12 12 4.149 19.851 12zm-3.183-.212a.3.3 0 0 0 0 .424l10.821 10.82a.3.3 0 0 0 .424 0l10.821-10.82a.3.3 0 0 0 0-.424L12.213.967a.3.3 0 0 0-.425 0z" />
    </svg>
  )
);
IconDiamondHalf24.displayName = 'IconDiamondHalf24';
