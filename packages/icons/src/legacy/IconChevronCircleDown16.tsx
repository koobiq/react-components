import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCircleChevronDown16 instead.
 */
export const IconChevronCircleDown16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M4.217 6.81l.566-.566a.2.2 0 0 1 .283 0L8 9.178l2.934-2.934a.2.2 0 0 1 .283 0l.566.565a.2.2 0 0 1 0 .283L8.566 10.31l-.016.014-.41.41a.2.2 0 0 1-.283 0l-.566-.565-.013-.015-3.06-3.06a.2.2 0 0 1 0-.284" />
    </svg>
  )
);
IconChevronCircleDown16.displayName = 'IconChevronCircleDown16';
