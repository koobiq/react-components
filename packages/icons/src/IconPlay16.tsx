import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlay16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12.906 7.839a.185.185 0 0 1 0 .322l-8.613 5.312c-.129.075-.293-.015-.293-.161V2.688c0-.146.164-.236.293-.16z" />
    </svg>
  )
);
IconPlay16.displayName = 'IconPlay16';
