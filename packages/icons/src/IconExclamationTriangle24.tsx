import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconExclamationTriangle24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M13.559 3.45c-.693-1.2-2.425-1.2-3.118 0L1.868 18.3c-.693 1.2.173 2.7 1.558 2.7h17.148c1.385 0 2.251-1.5 1.559-2.7zm-.383 3.45c.187 0 .335.158.323.344l-.503 7.155a.324.324 0 0 1-.323.303h-1.35A.324.324 0 0 1 11 14.4l-.5-7.155a.324.324 0 0 1 .323-.344zM12 18.67a1.435 1.435 0 1 1 0-2.87 1.435 1.435 0 0 1 0 2.87" />
    </svg>
  )
);
IconExclamationTriangle24.displayName = 'IconExclamationTriangle24';
