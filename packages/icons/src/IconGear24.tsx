import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGear24 = forwardRef(
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
        d="M19.784 6.656c-.5.5-.569 1.278-.275 1.922q.12.261.22.532c.249.663.847 1.165 1.555 1.165h.916a.3.3 0 0 1 .3.3v2.85a.3.3 0 0 1-.3.3h-.916c-.708 0-1.306.502-1.554 1.165q-.102.27-.221.532c-.294.644-.226 1.422.275 1.922l.648.649a.3.3 0 0 1 0 .424l-2.015 2.015a.3.3 0 0 1-.424 0l-.649-.648c-.5-.5-1.278-.569-1.922-.275q-.261.12-.532.22c-.663.249-1.165.847-1.165 1.555v.916a.3.3 0 0 1-.3.3h-2.85a.3.3 0 0 1-.3-.3v-.916c0-.708-.502-1.306-1.165-1.554a8 8 0 0 1-.532-.221c-.644-.294-1.422-.226-1.922.275l-.649.648a.3.3 0 0 1-.424 0l-2.015-2.015a.3.3 0 0 1 0-.424l.648-.649c.5-.5.569-1.278.275-1.922a8 8 0 0 1-.22-.532c-.249-.663-.847-1.165-1.555-1.165H1.8a.3.3 0 0 1-.3-.3v-2.85a.3.3 0 0 1 .3-.3h.916c.708 0 1.306-.502 1.554-1.165q.101-.27.221-.532c.294-.644.226-1.422-.275-1.922l-.648-.649a.3.3 0 0 1 0-.424l2.015-2.015a.3.3 0 0 1 .424 0l.649.648c.5.5 1.278.569 1.922.275q.261-.12.532-.22c.663-.249 1.165-.847 1.165-1.555V1.8a.3.3 0 0 1 .3-.3h2.85a.3.3 0 0 1 .3.3v.916c0 .708.502 1.306 1.165 1.554q.27.101.532.221c.644.294 1.422.226 1.922-.275l.649-.648a.3.3 0 0 1 .424 0l2.015 2.015a.3.3 0 0 1 0 .424zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9"
      />
    </svg>
  )
);
IconGear24.displayName = 'IconGear24';
