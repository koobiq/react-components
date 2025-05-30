import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTraffic16 = forwardRef(
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
        d="M8.17.591a.2.2 0 0 0-.34 0L5.441 4.414a.2.2 0 0 0 .17.306h1.588v3.39H4.72V6.52a.2.2 0 0 0-.306-.169L.591 8.741a.2.2 0 0 0 0 .338l3.823 2.39a.2.2 0 0 0 .306-.17v-1.59h2.479V15.8c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2V9.71h2.481v1.589a.2.2 0 0 0 .306.17l3.823-2.39a.2.2 0 0 0 0-.339l-3.823-2.389a.2.2 0 0 0-.306.17V8.11H8.799V4.72h1.59a.2.2 0 0 0 .17-.306z"
      />
    </svg>
  )
);
IconTraffic16.displayName = 'IconTraffic16';
