import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDesktopPlus24 = forwardRef(
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
      <g>
        <path d="M3.3 1.5h17.4a1.8 1.8 0 0 1 1.8 1.8v11.4a1.8 1.8 0 0 1-1.8 1.8H3.3a1.8 1.8 0 0 1-1.8-1.8V3.3a1.8 1.8 0 0 1 1.8-1.8m9.68 8.4h3.295c.124 0 .225-.1.225-.225v-1.35c0-.124-.1-.225-.225-.225H12.98V4.725c0-.124-.1-.225-.225-.225h-1.35c-.124 0-.225.1-.225.225V8.1H7.725c-.124 0-.225.1-.225.225v1.35c0 .124.1.225.225.225h3.455v3.375c0 .124.1.225.225.225h1.35c.124 0 .225-.1.225-.225zM9 20.1v-1.8h5.995v1.8H19.5v2.4h-15v-2.4z" />
      </g>
    </svg>
  )
);
IconDesktopPlus24.displayName = 'IconDesktopPlus24';
