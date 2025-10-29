import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDesktopPlus16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M2.2 1h11.6A1.2 1.2 0 0 1 15 2.2v7.6a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 9.8V2.2A1.2 1.2 0 0 1 2.2 1m6.453 5.6h2.197a.15.15 0 0 0 .15-.15v-.9a.15.15 0 0 0-.15-.15H8.653V3.15a.15.15 0 0 0-.15-.15h-.9a.15.15 0 0 0-.15.15V5.4H5.15a.15.15 0 0 0-.15.15v.9c0 .083.067.15.15.15h2.303v2.25c0 .083.067.15.15.15h.9a.15.15 0 0 0 .15-.15zM6 13.4v-1.2h3.997v1.2H13V15H3v-1.6z" />
      </g>
    </svg>
  )
);
IconDesktopPlus16.displayName = 'IconDesktopPlus16';
