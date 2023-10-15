import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelopeBadgeArrowRight16 = forwardRef(
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
        <path d="M0 3.4c0-.705.652-1.276 1.457-1.276h14.082c.804 0 1.456.571 1.456 1.275v.428l-8.37 4.08a.27.27 0 0 1-.254 0L0 3.826z" />
        <path d="M16.995 5.322v7.4l.005.024-.005-.002v.002l-.007-.006L11.4 9.259a.212.212 0 0 0-.325.18l-.027 2.686H7.435a.21.21 0 0 0-.212.213v2.533H1.457C.652 14.87 0 14.3 0 13.596V5.322l8.37 4.08a.27.27 0 0 0 .255 0z" />
        <path d="M16.707 14.43a.212.212 0 0 0 0-.36l-4.06-2.538a.212.212 0 0 0-.325.18V13.4H8.71a.21.21 0 0 0-.212.212v1.275c0 .117.095.212.212.212h3.612v1.688c0 .167.183.269.325.18z" />
      </g>
    </svg>
  )
);
IconEnvelopeBadgeArrowRight16.displayName = 'IconEnvelopeBadgeArrowRight16';
