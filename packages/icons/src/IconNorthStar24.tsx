import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNorthStar24 = forwardRef(
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
      <path d="M11.1 22.5a.3.3 0 0 1-.3-.3v-7.445l-3.374 3.374a.3.3 0 0 1-.425 0L5.73 16.856a.3.3 0 0 1 0-.424L8.96 13.2H1.8a.3.3 0 0 1-.3-.3v-1.8a.3.3 0 0 1 .3-.3h7.445L5.73 7.283a.3.3 0 0 1 0-.424L7 5.586a.3.3 0 0 1 .425 0L10.8 8.961V1.8a.3.3 0 0 1 .3-.3h1.8a.3.3 0 0 1 .3.3v7.16l3.374-3.374a.3.3 0 0 1 .425 0L18.27 6.86a.3.3 0 0 1 0 .424L14.755 10.8H22.2a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3h-7.16l3.231 3.232a.3.3 0 0 1 0 .424L17 18.13a.3.3 0 0 1-.425 0L13.2 14.755V22.2a.3.3 0 0 1-.3.3z" />
    </svg>
  )
);
IconNorthStar24.displayName = 'IconNorthStar24';
