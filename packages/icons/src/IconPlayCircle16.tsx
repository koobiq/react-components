import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlayCircle16 = forwardRef(
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
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.628-7.26a.296.296 0 0 1 0 .52l-5.476 2.954a.295.295 0 0 1-.435-.26V5.046c0-.224.238-.366.435-.26z"
      />
    </svg>
  )
);
IconPlayCircle16.displayName = 'IconPlayCircle16';