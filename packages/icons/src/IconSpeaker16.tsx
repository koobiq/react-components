import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSpeaker16 = forwardRef(
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
        d="M4.8 10.5h2.8l3.38 3.47c.063.064.17.019.17-.072V2.102c0-.09-.107-.136-.17-.072L7.6 5.5H4.8a1.2 1.2 0 0 0-1.2 1.2v2.6a1.2 1.2 0 0 0 1.2 1.2"
      />
    </svg>
  )
);
IconSpeaker16.displayName = 'IconSpeaker16';
