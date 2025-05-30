import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDesktopPlusO16 = forwardRef(
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
        <path d="M7.4 5.4V3.997c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2V5.4H10c.11 0 .2.09.2.2v.8a.2.2 0 0 1-.2.2H8.6v1.396a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2V6.6H5.997a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2z" />
        <path d="M2.2 1A1.2 1.2 0 0 0 1 2.2v7.6A1.2 1.2 0 0 0 2.2 11H6v2.4H3V15h10v-1.6H9.997V11H13.8A1.2 1.2 0 0 0 15 9.8V2.2A1.2 1.2 0 0 0 13.8 1zm.4 1.8c0-.11.09-.2.2-.2h10.4c.11 0 .2.09.2.2v6.4a.2.2 0 0 1-.2.2H2.8a.2.2 0 0 1-.2-.2z" />
      </g>
    </svg>
  )
);
IconDesktopPlusO16.displayName = 'IconDesktopPlusO16';
