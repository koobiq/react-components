import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNodeTree = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.007.3a.3.3 0 0 0-.3-.3H1.8a.3.3 0 0 0-.3.3v6.9a.3.3 0 0 0 .3.3h2.25v13.65a.3.3 0 0 0 .3.3H15v2.25a.3.3 0 0 0 .3.3h6.905a.3.3 0 0 0 .3-.3V16.8a.3.3 0 0 0-.3-.3H15.3a.3.3 0 0 0-.3.3v2.249H6.45v-6.96h8.549v2.1a.3.3 0 0 0 .3.3h6.906a.3.3 0 0 0 .3-.3v-6.9a.3.3 0 0 0-.3-.3H15.3a.3.3 0 0 0-.3.3v2.4H6.45V7.5h2.257a.3.3 0 0 0 .3-.3z"
      />
    </svg>
  )
);
IconNodeTree.displayName = 'IconNodeTree';
