import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const Icon3Columns24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M20.7 1.5a1.8 1.8 0 0 1 1.8 1.8v17.4a1.8 1.8 0 0 1-1.8 1.8H3.3a1.8 1.8 0 0 1-1.8-1.8V3.3a1.8 1.8 0 0 1 1.8-1.8zM10.096 20.1h3.81V3.9h-3.81zm6.21 0H19.8c.166 0 .3-.134.3-.3V4.2c0-.166-.134-.3-.3-.3h-3.495zM4.2 3.9c-.166 0-.3.134-.3.3v15.6c0 .166.134.3.3.3h3.496V3.9z" />
    </svg>
  )
);
Icon3Columns24.displayName = 'Icon3Columns24';
