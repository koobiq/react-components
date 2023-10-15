import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBolt16 = forwardRef(
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
        d="M5.465.142C5.488.057 5.553 0 5.627 0h4.769c.12 0 .202.145.16.28L8.708 6.225h4.12c.149 0 .227.213.128.346l-6.957 9.36c-.121.164-.342.016-.292-.196l1.51-6.398H3.17c-.116 0-.2-.139-.162-.273z"
      />
    </svg>
  )
);
IconBolt16.displayName = 'IconBolt16';
