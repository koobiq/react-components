import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSpeaker24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M7.2 15.75h4.2l5.07 5.205c.094.096.256.028.256-.108V3.153c0-.136-.162-.204-.256-.108L11.4 8.25H7.2a1.8 1.8 0 0 0-1.8 1.8v3.9a1.8 1.8 0 0 0 1.8 1.8" />
    </svg>
  )
);
IconSpeaker24.displayName = 'IconSpeaker24';
