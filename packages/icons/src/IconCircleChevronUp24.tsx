import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleChevronUp24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5m5.674 12.286-.848.848a.3.3 0 0 1-.425 0L12 10.234l-4.401 4.4a.3.3 0 0 1-.425 0l-.848-.848a.3.3 0 0 1 0-.424l4.826-4.826.022-.02.616-.616a.3.3 0 0 1 .424 0l.849.848.02.023 4.591 4.59a.3.3 0 0 1 0 .425" />
    </svg>
  )
);
IconCircleChevronUp24.displayName = 'IconCircleChevronUp24';
