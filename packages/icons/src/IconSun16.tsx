import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSun16 = forwardRef(
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
        d="M11.362 3.434a1.9 1.9 0 0 1-2.205-.913L8.083.551a.095.095 0 0 0-.167 0l-1.074 1.97a1.9 1.9 0 0 1-2.204.913L3.1 2.982a.095.095 0 0 0-.118.118l.452 1.538a1.9 1.9 0 0 1-.913 2.205L.55 7.917a.095.095 0 0 0 0 .167l1.97 1.074a1.9 1.9 0 0 1 .913 2.204L2.982 12.9a.095.095 0 0 0 .118.118l1.538-.452a1.9 1.9 0 0 1 2.204.913l1.075 1.97c.036.066.13.066.166 0l1.074-1.97a1.9 1.9 0 0 1 2.205-.913l1.538.452a.095.095 0 0 0 .118-.118l-.452-1.538a1.9 1.9 0 0 1 .913-2.204l1.97-1.074a.095.095 0 0 0 0-.167l-1.97-1.074a1.9 1.9 0 0 1-.913-2.205l.452-1.538a.095.095 0 0 0-.118-.118z"
      />
    </svg>
  )
);
IconSun16.displayName = 'IconSun16';
