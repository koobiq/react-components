import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBug16 = forwardRef(
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
        d="M6.269 3.578 4.64 1.923a.206.206 0 0 1 0-.288l.566-.575a.2.2 0 0 1 .283 0l1.813 1.843a2.3 2.3 0 0 1 1.394 0L10.51 1.06a.2.2 0 0 1 .283 0l.566.575a.206.206 0 0 1 0 .288L9.73 3.578c.304.341.511.774.579 1.252h.99c.11 0 .2.09.2.203v.712h1.3V3c0-.112.09-.203.2-.203h.8c.11 0 .2.09.2.203v3.763c0 .112-.09.204-.2.204h-2.3v1.322h2.3c.11 0 .2.09.2.203v.814c0 .112-.09.203-.2.203h-2.3v.915q0 .207-.023.407H13.8c.11 0 .2.091.2.204v3.763c0 .112-.09.203-.2.203H13c-.11 0-.2-.091-.2-.203V12.05h-1.686A3.49 3.49 0 0 1 8 13.983a3.49 3.49 0 0 1-3.114-1.932H3.2v2.746c0 .112-.09.203-.2.203h-.8c-.11 0-.2-.091-.2-.203v-3.763c0-.113.09-.204.2-.204h2.323a4 4 0 0 1-.023-.407v-.915H2.2c-.11 0-.2-.091-.2-.203V8.49c0-.112.09-.203.2-.203h2.3V6.966H2.2c-.11 0-.2-.092-.2-.204V3c0-.112.09-.203.2-.203H3c.11 0 .2.09.2.203v2.746h1.3v-.712c0-.112.09-.203.2-.203h.99c.068-.478.275-.91.579-1.252"
      />
    </svg>
  )
);
IconBug16.displayName = 'IconBug16';