import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsBoldHorizontal16 = forwardRef(
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
        <path d="M2 1.38C2 .618 2.537 0 3.2 0h9.6c.663 0 1.2.618 1.2 1.38v1.84c0 .762-.537 1.38-1.2 1.38H3.2C2.537 4.6 2 3.982 2 3.22zM2 7.18c0-.762.537-1.38 1.2-1.38h9.6c.663 0 1.2.618 1.2 1.38v1.84c0 .762-.537 1.38-1.2 1.38H3.2c-.663 0-1.2-.618-1.2-1.38zM3.2 11.6c-.663 0-1.2.591-1.2 1.32v1.76c0 .729.537 1.32 1.2 1.32h9.6c.663 0 1.2-.591 1.2-1.32v-1.76c0-.729-.537-1.32-1.2-1.32z" />
      </g>
    </svg>
  )
);
IconBarsBoldHorizontal16.displayName = 'IconBarsBoldHorizontal16';