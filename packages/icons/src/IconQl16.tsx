import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconQl16 = forwardRef(
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
        d="M7.544 11.898c.946-.847 1.533-2.172 1.533-3.9 0-3.17-1.969-4.978-4.538-4.978C1.955 3.02 0 4.828 0 7.999c0 3.156 1.955 4.978 4.539 4.978.605 0 1.178-.099 1.699-.298l.72.887a.2.2 0 0 0 .156.074h1.609a.1.1 0 0 0 .078-.162zM5.63 9.552a.2.2 0 0 0-.157-.077H4.03a.1.1 0 0 0-.08.16l1.119 1.478a2.7 2.7 0 0 1-.53.052c-1.491 0-2.461-1.112-2.461-3.166s.97-3.166 2.46-3.166C6.026 4.833 7 5.945 7 7.999c0 1.055-.26 1.864-.71 2.4zm4.366-6.4a.2.2 0 0 0-.2.2v9.293c0 .11.09.2.2.2H15.8a.2.2 0 0 0 .2-.2v-1.29a.2.2 0 0 0-.2-.2h-3.955V3.352a.2.2 0 0 0-.2-.2z"
      />
    </svg>
  )
);
IconQl16.displayName = 'IconQl16';