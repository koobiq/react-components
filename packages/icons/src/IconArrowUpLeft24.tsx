import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpLeft24 = forwardRef(
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
        d="M8.627 6.919h7.467a.3.3 0 0 0 .302-.303V4.802a.3.3 0 0 0-.302-.302H4.8a.3.3 0 0 0-.302.302v11.294c0 .167.135.303.302.303h1.814a.3.3 0 0 0 .303-.303V8.63l11.457 11.457c.118.119.31.119.428 0l1.282-1.282a.3.3 0 0 0 0-.428z"
      />
    </svg>
  )
);
IconArrowUpLeft24.displayName = 'IconArrowUpLeft24';
