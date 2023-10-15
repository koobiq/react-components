import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldUser16 = forwardRef(
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
        d="M7.98 15.446 1.5 11.418V2.202a.7.7 0 0 1 .7-.702h11.6a.7.7 0 0 1 .7.702v9.215zm1.875-8.938a3 3 0 0 0 .106-.774c0-1.156-.817-2.23-1.981-2.23S6 4.578 6 5.734c0 .257.036.52.105.774h-.141l.457.759q.077.128.168.247c.315.415.79.765 1.39.765.607 0 1.086-.357 1.401-.778q.086-.112.159-.234l.457-.759zm.63.503-.448-.251-.24.455q-.09.173-.198.326c-.343.49-.9.94-1.62.94-.718 0-1.275-.45-1.619-.94a3 3 0 0 1-.19-.312l-.24-.451-.446.25-.465.26a1.7 1.7 0 0 0-.835 1.825l.376 1.84a.7.7 0 0 0 .686.561h5.506a.7.7 0 0 0 .686-.56l.375-1.841a1.7 1.7 0 0 0-.835-1.825z"
      />
    </svg>
  )
);
IconShieldUser16.displayName = 'IconShieldUser16';
