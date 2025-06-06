import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCrosshairs16 = forwardRef(
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
        <path d="M10.25 8a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0" />
        <path d="M8.8.2a.2.2 0 0 0-.2-.2H7.4a.2.2 0 0 0-.2.2v.845A7 7 0 0 0 1.045 7.2H.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h.845A7 7 0 0 0 7.2 14.955v.845c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2v-.845A7 7 0 0 0 14.955 8.8h.845a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2h-.845A7 7 0 0 0 8.8 1.045zm-6.141 7A5.4 5.4 0 0 1 7.2 2.659V3.8c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2V2.659A5.4 5.4 0 0 1 13.341 7.2H12.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h1.141A5.4 5.4 0 0 1 8.8 13.341V12.2a.2.2 0 0 0-.2-.2H7.4a.2.2 0 0 0-.2.2v1.141A5.4 5.4 0 0 1 2.659 8.8H3.8a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2z" />
      </g>
    </svg>
  )
);
IconCrosshairs16.displayName = 'IconCrosshairs16';
