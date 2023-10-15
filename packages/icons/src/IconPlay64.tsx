import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlay64 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={64}
      height={64}
      fill="currentColor"
      viewBox="0 0 64 64"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 14.652c0-1.85 0-2.775.388-3.303a2 2 0 0 1 1.426-.808c.653-.061 1.446.415 3.032 1.367l30.483 18.29c1.536.92 2.304 1.382 2.56 1.974a2 2 0 0 1-.016 1.616c-.265.587-1.042 1.034-2.595 1.927L16.795 53.243c-1.574.905-2.36 1.357-3.007 1.288a2 2 0 0 1-1.407-.814C12 53.192 12 52.284 12 50.47z"
      />
    </svg>
  )
);
IconPlay64.displayName = 'IconPlay64';
