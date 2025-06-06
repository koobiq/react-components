import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMessageArrowRight16 = forwardRef(
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
        d="M1 4.4A2.4 2.4 0 0 1 3.4 2h9.2A2.4 2.4 0 0 1 15 4.4v6.2a2.4 2.4 0 0 1-2.4 2.4H7.75l-3.425 2.74A.2.2 0 0 1 4 15.584V13h-.6A2.4 2.4 0 0 1 1 10.6zm8.308.319a.2.2 0 0 0-.283 0l-.566.565a.2.2 0 0 0 0 .283l1.335 1.334H4.2a.2.2 0 0 0-.2.2v.8c0 .11.09.2.2.2h5.594L8.459 9.436a.2.2 0 0 0 0 .283l.566.565a.2.2 0 0 0 .283 0l2.641-2.641a.2.2 0 0 0 0-.283z"
      />
    </svg>
  )
);
IconMessageArrowRight16.displayName = 'IconMessageArrowRight16';
