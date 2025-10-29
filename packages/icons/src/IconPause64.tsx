import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPause64 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M18.218 13.092C18 13.52 18 14.08 18 15.2v33.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C19.52 52 20.08 52 21.2 52h3.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C28 50.48 28 49.92 28 48.8V15.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C26.48 12 25.92 12 24.8 12h-3.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874m18 0C36 13.52 36 14.08 36 15.2v33.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C37.52 52 38.08 52 39.2 52h3.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C46 50.48 46 49.92 46 48.8V15.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C44.48 12 43.92 12 42.8 12h-3.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874" />
    </svg>
  )
);
IconPause64.displayName = 'IconPause64';
