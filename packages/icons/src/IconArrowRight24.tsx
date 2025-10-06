import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRight24 = forwardRef(
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
        d="M17.997 13.18H1.802a.3.3 0 0 1-.302-.3v-1.81a.3.3 0 0 1 .302-.299h16.195l-5.28-5.257a.297.297 0 0 1 0-.422l1.284-1.279a.304.304 0 0 1 .428 0l7.983 7.951a.297.297 0 0 1 0 .422l-7.983 7.951a.304.304 0 0 1-.428 0l-1.283-1.278a.297.297 0 0 1 0-.422z"
      />
    </svg>
  )
);
IconArrowRight24.displayName = 'IconArrowRight24';
