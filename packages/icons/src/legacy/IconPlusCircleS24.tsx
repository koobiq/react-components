import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCirclePlusS24 instead.
 */
export const IconPlusCircleS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M5.636 18.364A9 9 0 1 0 18.364 5.636 9 9 0 0 0 5.636 18.364M16.275 12.9H12.98v3.375c0 .124-.1.225-.225.225h-1.35a.225.225 0 0 1-.225-.225V12.9H7.725a.225.225 0 0 1-.225-.225v-1.35c0-.124.1-.225.225-.225h3.455V7.725c0-.124.1-.225.225-.225h1.35c.124 0 .225.1.225.225V11.1h3.295c.124 0 .225.1.225.225v1.35c0 .124-.1.225-.225.225" />
    </svg>
  )
);
IconPlusCircleS24.displayName = 'IconPlusCircleS24';
