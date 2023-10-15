import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconClockBadgePlay16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={17}
      height={17}
      fill="currentColor"
      viewBox="0 0 17 17"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M8.499 14.235c.73 0 1.429-.136 2.071-.385v1.793a7.436 7.436 0 1 1 4.999-4.833l-1.476-1.034q.14-.617.142-1.277A5.737 5.737 0 1 0 8.5 14.235" />
        <path d="M9.136 9.349a.21.21 0 0 0 .213-.213V4.462a.21.21 0 0 0-.213-.213H7.861a.21.21 0 0 0-.212.213v3.187H4.745a.21.21 0 0 0-.212.212v1.275c0 .117.095.213.212.213zM11.845 10.167c0-.172.194-.273.334-.174l4.73 3.31c.12.085.12.264 0 .348l-4.73 3.31a.212.212 0 0 1-.334-.174z" />
      </g>
    </svg>
  )
);
IconClockBadgePlay16.displayName = 'IconClockBadgePlay16';
