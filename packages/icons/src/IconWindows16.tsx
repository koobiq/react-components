import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconWindows16 = forwardRef(
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
        d="M8 2.18c0-.09.07-.166.16-.174l6.65-.57a.175.175 0 0 1 .19.174v5.54a.175.175 0 0 1-.175.175h-6.65A.175.175 0 0 1 8 7.15zm-6.843.535A.175.175 0 0 0 1 2.889V7.15c0 .097.078.175.175.175h5.377a.175.175 0 0 0 .175-.175V2.324a.175.175 0 0 0-.193-.174zm-.01 9.884A.175.175 0 0 1 1 12.426V8.813c0-.097.078-.175.175-.175h5.377c.097 0 .175.078.175.175v4.46c0 .107-.096.19-.202.173zm7.006 1.062A.175.175 0 0 1 8 13.488V8.813c0-.097.078-.175.175-.175h6.65c.097 0 .175.078.175.175v5.532a.175.175 0 0 1-.197.174z"
      />
    </svg>
  )
);
IconWindows16.displayName = 'IconWindows16';
