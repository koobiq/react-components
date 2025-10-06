import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBoxOpen24 = forwardRef(
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
        <path d="M1.802 1.5a.3.3 0 0 0-.285.399L2.956 6h3.796l-.695-1.844a.3.3 0 0 1 .282-.406h2.37c.125 0 .238.078.282.195L9.765 6h4.551l-1.578-4.5zM16.232 6h4.746l1.506-4.105a.3.3 0 0 0-.286-.395h-7.545zM2.884 7.8v14.4a.3.3 0 0 0 .302.3h11.238V7.8h-4.376v3.9a.3.3 0 0 1-.302.3h-2.41a.3.3 0 0 1-.302-.3V7.8zM16.232 22.5h4.444a.3.3 0 0 0 .302-.3V7.8h-4.746z" />
      </g>
    </svg>
  )
);
IconBoxOpen24.displayName = 'IconBoxOpen24';
