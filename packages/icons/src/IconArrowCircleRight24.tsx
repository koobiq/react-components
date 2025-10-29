import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowCircleRight24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M22.5 12c0-5.799-4.701-10.5-10.5-10.5S1.5 6.201 1.5 12 6.201 22.5 12 22.5 22.5 17.799 22.5 12m-4.694-.642.042.045.388.387a.3.3 0 0 1 0 .424l-.849.849-.023.02-4.59 4.591a.3.3 0 0 1-.425 0l-.848-.848a.3.3 0 0 1 0-.425l3.501-3.501H6.3a.3.3 0 0 1-.3-.3v-1.2a.3.3 0 0 1 .3-.3h8.702l-3.501-3.501a.3.3 0 0 1 0-.425l.848-.848a.3.3 0 0 1 .425 0z" />
    </svg>
  )
);
IconArrowCircleRight24.displayName = 'IconArrowCircleRight24';
