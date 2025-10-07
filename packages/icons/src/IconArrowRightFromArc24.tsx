import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRightFromArc24 = forwardRef(
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
        <path d="M1.5 12.004c0 5.7 4.566 10.34 10.259 10.5a.295.295 0 0 0 .302-.296v-1.8a.31.31 0 0 0-.302-.306c-4.36-.158-7.845-3.723-7.845-8.098s3.485-7.94 7.845-8.098a.31.31 0 0 0 .302-.305V1.8c0-.166-.136-.3-.302-.296-5.693.16-10.259 4.8-10.259 10.5" />
        <path d="m18.06 10.803-3.714-3.742a.3.3 0 0 1 0-.422l1.26-1.27a.303.303 0 0 1 .43 0l6.377 6.424a.3.3 0 0 1 0 .422l-6.377 6.424a.303.303 0 0 1-.43 0l-1.26-1.271a.3.3 0 0 1 0-.422l3.714-3.742H7.233v-2.4z" />
      </g>
    </svg>
  )
);
IconArrowRightFromArc24.displayName = 'IconArrowRightFromArc24';
