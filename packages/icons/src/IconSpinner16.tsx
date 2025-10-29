import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSpinner16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M5.934 12.989A5.399 5.399 0 1 0 8.2 2.604.206.206 0 0 1 8 2.4V1.2c0-.11.09-.2.2-.197A7 7 0 1 1 1.003 8.2.196.196 0 0 1 1.2 8h1.2c.11 0 .2.09.204.2a5.4 5.4 0 0 0 3.33 4.789" />
    </svg>
  )
);
IconSpinner16.displayName = 'IconSpinner16';
