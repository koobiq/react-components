import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAsterisk24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M10.8 22.2a.3.3 0 0 0 .3.3h1.8a.3.3 0 0 0 .3-.3v-7.303l5.164 5.164a.3.3 0 0 0 .424 0l1.273-1.273a.3.3 0 0 0 0-.424L14.897 13.2H22.2a.3.3 0 0 0 .3-.3v-1.8a.3.3 0 0 0-.3-.3h-7.303l5.164-5.164a.3.3 0 0 0 0-.424l-1.273-1.273a.3.3 0 0 0-.424 0L13.2 9.103V1.8a.3.3 0 0 0-.3-.3h-1.8a.3.3 0 0 0-.3.3v7.303L5.636 3.939a.3.3 0 0 0-.424 0L3.939 5.212a.3.3 0 0 0 0 .424L9.103 10.8H1.8a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h7.303l-5.164 5.164a.3.3 0 0 0 0 .424l1.273 1.273a.3.3 0 0 0 .424 0l5.164-5.164z" />
    </svg>
  )
);
IconAsterisk24.displayName = 'IconAsterisk24';
