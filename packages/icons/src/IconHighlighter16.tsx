import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconHighlighter16 = forwardRef(
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
        d="m3.89 14.233-1.062 1.06L0 13.88l1.768-1.767zm3.181-1.06-.212-.213a1.2 1.2 0 0 0-1.697 0l-.424.424-2.122-2.121.425-.425a1.2 1.2 0 0 0 0-1.697l-.213-.211 1.415-1.415 4.242 4.243zM14.65 2.646a1.2 1.2 0 0 1 .082 1.607L9.192 11.05 4.95 6.808l6.797-5.539a1.2 1.2 0 0 1 1.607.083z"
      />
    </svg>
  )
);
IconHighlighter16.displayName = 'IconHighlighter16';
