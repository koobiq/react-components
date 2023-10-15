import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPinSlash16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M14.307 15.441a.2.2 0 0 0 .284 0l.85-.85a.2.2 0 0 0 0-.284l-4.515-4.515a4.5 4.5 0 0 0-.339-.8L14 7.077c.698-.39.829-1.34.264-1.905l-3.435-3.435a1.206 1.206 0 0 0-1.905.264L7.01 5.415a4.5 4.5 0 0 0-.799-.338L1.693.56a.2.2 0 0 0-.284 0l-.85.85a.2.2 0 0 0 0 .284zM2.529 5.363l8.108 8.11c-.219.46-.507.893-.862 1.277a.19.19 0 0 1-.277.005l-3.565-3.55-3.465 3.464a.2.2 0 0 1-.109.056l-1.16.19a.1.1 0 0 1-.113-.115l.189-1.16a.2.2 0 0 1 .056-.108l3.464-3.465-3.552-3.563a.19.19 0 0 1 .005-.277 5.1 5.1 0 0 1 1.28-.864" />
      </g>
    </svg>
  )
);
IconPinSlash16.displayName = 'IconPinSlash16';
