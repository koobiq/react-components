import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFloppyDisk16 = forwardRef(
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
        d="M11.503 1a1.2 1.2 0 0 1 .848.351l2.297 2.298a1.2 1.2 0 0 1 .352.848V13.8a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 13.8V2.2A1.2 1.2 0 0 1 2.2 1zM11 2.4a.2.2 0 0 0-.2-.2H9.6v2.4a.2.2 0 0 1-.2.2H8.2a.2.2 0 0 1-.2-.2V2.2H4.2a.2.2 0 0 0-.2.2v3.4c0 .11.09.2.2.2h6.6a.2.2 0 0 0 .2-.2zM3 8.6v4.6c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2V8.6a.2.2 0 0 0-.2-.2H3.2a.2.2 0 0 0-.2.2"
      />
    </svg>
  )
);
IconFloppyDisk16.displayName = 'IconFloppyDisk16';