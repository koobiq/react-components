import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCirclePlusS16 instead.
 */
export const IconPlusCircleS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M3.757 12.243a6 6 0 1 0 8.486-8.485 6 6 0 0 0-8.486 8.485M10.85 8.6H8.653v2.25a.15.15 0 0 1-.15.15h-.9a.15.15 0 0 1-.15-.15V8.6H5.15A.15.15 0 0 1 5 8.45v-.9a.15.15 0 0 1 .15-.15h2.303V5.15a.15.15 0 0 1 .15-.15h.9a.15.15 0 0 1 .15.15V7.4h2.197a.15.15 0 0 1 .15.15v.9a.15.15 0 0 1-.15.15" />
    </svg>
  )
);
IconPlusCircleS16.displayName = 'IconPlusCircleS16';
