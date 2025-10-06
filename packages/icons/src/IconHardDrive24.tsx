import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconHardDrive24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M4.8 1.5A1.8 1.8 0 0 0 3 3.3v10.382a3.6 3.6 0 0 1 1.8-.482h14.4c.656 0 1.27.175 1.8.482V3.3a1.8 1.8 0 0 0-1.8-1.8zM20.975 16.5A1.8 1.8 0 0 0 19.2 15H4.8A1.8 1.8 0 0 0 3 16.8v3.9a1.8 1.8 0 0 0 1.8 1.8h14.4a1.8 1.8 0 0 0 1.8-1.8v-3.9a2 2 0 0 0-.025-.3M5.25 18.6v-1.2a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3v1.2a.3.3 0 0 1-.3.3h-3.9a.3.3 0 0 1-.3-.3" />
      </g>
    </svg>
  )
);
IconHardDrive24.displayName = 'IconHardDrive24';
