import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleCheck24 = forwardRef(
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
      <path d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5m-1.502-5.916a.3.3 0 0 1-.424 0l-3.855-3.855a.3.3 0 0 1 0-.425l.848-.848a.3.3 0 0 1 .424 0l2.795 2.794 6.223-6.223a.3.3 0 0 1 .424 0l.848.849a.3.3 0 0 1 0 .424z" />
    </svg>
  )
);
IconCircleCheck24.displayName = 'IconCircleCheck24';
