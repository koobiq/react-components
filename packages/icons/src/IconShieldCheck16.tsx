import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldCheck16 = forwardRef(
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
        d="M2.2 1A1.2 1.2 0 0 0 1 2.202v9.383a.2.2 0 0 0 .115.181l6.8 4.215a.2.2 0 0 0 .17 0l6.8-4.214a.2.2 0 0 0 .115-.182V2.202A1.2 1.2 0 0 0 13.8 1zm10.083 4.572L7.14 10.721a.2.2 0 0 1-.282 0L3.717 7.575a.2.2 0 0 1 0-.283l.566-.567a.2.2 0 0 1 .283 0L7 9.163l4.434-4.44a.2.2 0 0 1 .283 0l.566.566a.2.2 0 0 1 0 .283"
      />
    </svg>
  )
);
IconShieldCheck16.displayName = 'IconShieldCheck16';