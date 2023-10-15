import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconStop64 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={64}
      height={64}
      fill="currentColor"
      viewBox="0 0 64 64"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 15.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C13.52 12 14.08 12 15.2 12h33.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C52 13.52 52 14.08 52 15.2v33.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C50.48 52 49.92 52 48.8 52H15.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C12 50.48 12 49.92 12 48.8z"
      />
    </svg>
  )
);
IconStop64.displayName = 'IconStop64';
