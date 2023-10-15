import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheckboxMultiple16 = forwardRef(
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
        <path d="M13.2 2.6c.11 0 .2.09.2.2v9.4h.4A1.2 1.2 0 0 0 15 11V2.2A1.2 1.2 0 0 0 13.8 1H5a1.2 1.2 0 0 0-1.2 1.2v.4z" />
        <path d="M2.6 5.6c0-.11.09-.2.2-.2h7.6c.11 0 .2.09.2.2v7.6a.2.2 0 0 1-.2.2H2.8a.2.2 0 0 1-.2-.2zm-.4-1.8A1.2 1.2 0 0 0 1 5v8.8A1.2 1.2 0 0 0 2.2 15H11a1.2 1.2 0 0 0 1.2-1.2V5A1.2 1.2 0 0 0 11 3.8z" />
        <path d="M9.806 7.79a.2.2 0 0 1 0 .283l-3.783 3.783a.2.2 0 0 1-.283 0L3.391 9.507a.2.2 0 0 1 0-.283l.849-.848a.2.2 0 0 1 .283 0L5.88 9.734l2.793-2.793a.2.2 0 0 1 .283 0z" />
      </g>
    </svg>
  )
);
IconCheckboxMultiple16.displayName = 'IconCheckboxMultiple16';
