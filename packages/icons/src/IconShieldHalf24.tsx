import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldHalf24 = forwardRef(
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
      <path d="M12.157 23.956a.3.3 0 0 1-.314 0l-10.2-6.287a.3.3 0 0 1-.143-.256V3.304c0-.996.806-1.804 1.8-1.804h17.4c.994 0 1.8.808 1.8 1.804v14.109a.3.3 0 0 1-.143.256zM12 3.906v17.322l7.957-4.904a.3.3 0 0 0 .143-.256V4.206a.3.3 0 0 0-.3-.3z" />
    </svg>
  )
);
IconShieldHalf24.displayName = 'IconShieldHalf24';
