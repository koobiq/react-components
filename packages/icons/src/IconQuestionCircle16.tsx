import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconQuestionCircle16 = forwardRef(
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
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m.887-3.985a.887.887 0 1 1-1.774 0 .887.887 0 0 1 1.774 0m-1.633-1.74v-.15c.004-1.28.348-1.672.962-2.06.45-.284.797-.602.797-1.081 0-.508-.399-.837-.892-.837-.425 0-.82.25-.92.722-.022.106-.108.192-.216.192H5.89a.19.19 0 0 1-.193-.205c.125-1.323 1.167-1.952 2.43-1.952 1.452 0 2.483.745 2.483 2.025 0 .86-.447 1.396-1.13 1.802-.578.348-.834.68-.841 1.393v.151a.2.2 0 0 1-.2.2h-.986a.2.2 0 0 1-.2-.2"
      />
    </svg>
  )
);
IconQuestionCircle16.displayName = 'IconQuestionCircle16';