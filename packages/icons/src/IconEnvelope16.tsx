import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelope16 = forwardRef(
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
        d="M2.2 2A1.2 1.2 0 0 0 1 3.2v1.157l7 3.377 7-3.377V3.2A1.2 1.2 0 0 0 13.8 2zM15 5.69 8 9.066 1 5.69v7.11A1.2 1.2 0 0 0 2.2 14h11.6a1.2 1.2 0 0 0 1.2-1.2z"
      />
    </svg>
  )
);
IconEnvelope16.displayName = 'IconEnvelope16';
