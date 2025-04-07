import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconClockBadgePlay16 = forwardRef(
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
        d="M8 13.4c.631 0 1.237-.108 1.8-.307v1.673a7 7 0 1 1 4.913-4.775L13.31 8.986q.09-.481.09-.986A5.4 5.4 0 1 0 8 13.4m.6-4.6a.2.2 0 0 0 .2-.2V4.2a.2.2 0 0 0-.2-.2H7.4a.2.2 0 0 0-.2.2v3H4.467a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2zm2.724.239C11.188 8.94 11 9.04 11 9.21v6.578c0 .17.188.27.324.172l4.588-3.288a.214.214 0 0 0 0-.346z"
      />
    </svg>
  )
);
IconClockBadgePlay16.displayName = 'IconClockBadgePlay16';
