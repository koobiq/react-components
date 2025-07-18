import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAuroraOs16 = forwardRef(
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
        fillRule="evenodd"
        d="m8.086 15.852 2.19-3.753a.2.2 0 0 1 .172-.099h4.378l.052-.014a.1.1 0 0 0 .034-.136l-1.02-1.75a.2.2 0 0 0-.173-.1h-1.484l.74-1.269a.2.2 0 0 0 0-.201l-1.064-1.826a.1.1 0 0 0-.173 0L9.815 10H8.427l2.644-4.533a.2.2 0 0 0 0-.202L10.007 3.44a.1.1 0 0 0-.173 0L6.006 10H4.618l4.55-7.798a.2.2 0 0 0 0-.201L8.085.148a.1.1 0 0 0-.172 0L1.088 11.85a.1.1 0 0 0 .035.136l.051.014h4.378a.2.2 0 0 1 .173.1l2.189 3.752.038.037a.1.1 0 0 0 .097 0zM1.08 11.869v-.002z"
        clipRule="evenodd"
      />
    </svg>
  )
);
IconAuroraOs16.displayName = 'IconAuroraOs16';
