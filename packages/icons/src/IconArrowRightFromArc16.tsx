import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowRightFromArc16 = forwardRef(
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
        <path d="M1 8.003c0 3.8 3.044 6.893 6.84 7a.197.197 0 0 0 .2-.198v-1.2c0-.11-.09-.2-.2-.204-2.907-.105-5.23-2.482-5.23-5.398 0-2.917 2.323-5.293 5.23-5.399a.207.207 0 0 0 .2-.204V1.2c0-.11-.09-.2-.2-.197-3.796.106-6.84 3.2-6.84 7" />
        <path d="M12.04 7.202 9.564 4.707a.2.2 0 0 1 0-.28l.84-.848a.2.2 0 0 1 .287 0l4.251 4.283a.2.2 0 0 1 0 .281l-4.251 4.283a.2.2 0 0 1-.287 0l-.84-.847a.2.2 0 0 1 0-.282l2.476-2.494H4.822v-1.6z" />
      </g>
    </svg>
  )
);
IconArrowRightFromArc16.displayName = 'IconArrowRightFromArc16';
