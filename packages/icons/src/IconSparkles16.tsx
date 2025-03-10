import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSparkles16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M12.692.656c-.056-.192-.328-.192-.384 0l-.354 1.211a1.6 1.6 0 0 1-1.087 1.087l-1.21.354c-.192.056-.192.328 0 .384l1.21.354a1.6 1.6 0 0 1 1.087 1.087l.354 1.21c.056.192.328.192.384 0l.354-1.21a1.6 1.6 0 0 1 1.087-1.087l1.21-.354c.192-.056.192-.328 0-.384l-1.21-.354a1.6 1.6 0 0 1-1.087-1.087zM7.384 3.313c-.112-.384-.656-.384-.768 0l-.708 2.422a3.2 3.2 0 0 1-2.173 2.173l-2.422.708c-.384.112-.384.656 0 .768l2.422.708a3.2 3.2 0 0 1 2.173 2.173l.708 2.422c.112.384.656.384.768 0l.708-2.422a3.2 3.2 0 0 1 2.173-2.173l2.422-.708c.384-.112.384-.656 0-.768l-2.422-.708a3.2 3.2 0 0 1-2.173-2.173z" />
      </g>
    </svg>
  )
);
IconSparkles16.displayName = 'IconSparkles16';
