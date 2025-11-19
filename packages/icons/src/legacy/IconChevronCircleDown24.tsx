import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCircleChevronDown24 instead.
 */
export const IconChevronCircleDown24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5M6.326 10.214l.848-.849a.3.3 0 0 1 .425 0L12 13.767l4.401-4.402a.3.3 0 0 1 .425 0l.848.849a.3.3 0 0 1 0 .424l-4.825 4.826-.023.02-.616.616a.3.3 0 0 1-.424 0l-.849-.848-.02-.023-4.591-4.59a.3.3 0 0 1 0-.425" />
    </svg>
  )
);
IconChevronCircleDown24.displayName = 'IconChevronCircleDown24';
