import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUp16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m7.181 4.084-3.505 3.52a.2.2 0 0 1-.281 0l-.853-.856a.2.2 0 0 1 0-.285l5.3-5.322a.2.2 0 0 1 .282 0l5.3 5.322a.2.2 0 0 1 0 .285l-.851.856a.2.2 0 0 1-.282 0l-3.505-3.52v10.797a.2.2 0 0 1-.2.201H7.38a.2.2 0 0 1-.199-.201z" />
    </svg>
  )
);
IconArrowUp16.displayName = 'IconArrowUp16';
