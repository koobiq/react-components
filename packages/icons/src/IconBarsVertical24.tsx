import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsVertical24 = forwardRef(
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
        <path d="M3.3 21c-.166 0-.3-.1-.3-.225V3.225C3 3.101 3.134 3 3.3 3h3.15c.166 0 .3.1.3.225v17.55c0 .124-.134.225-.3.225zM17.55 21c-.166 0-.3-.1-.3-.225V3.225c0-.124.134-.225.3-.225h3.15c.166 0 .3.1.3.225v17.55c0 .124-.134.225-.3.225zM10.425 3c-.166 0-.3.1-.3.225v17.55c0 .124.134.225.3.225h3.15c.166 0 .3-.1.3-.225V3.225c0-.124-.134-.225-.3-.225z" />
      </g>
    </svg>
  )
);
IconBarsVertical24.displayName = 'IconBarsVertical24';
