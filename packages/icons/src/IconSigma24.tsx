import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSigma24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M18.75 19.385a.3.3 0 0 0-.3-.3H9.59l5.11-6.939a.3.3 0 0 0 .058-.178v-.07a.3.3 0 0 0-.06-.179l-5.07-6.79h8.362a.3.3 0 0 0 .3-.3V2.55a.3.3 0 0 0-.3-.3H5.55a.3.3 0 0 0-.3.3v1.552a.3.3 0 0 0 .063.185l5.965 7.646-5.966 7.78a.3.3 0 0 0-.062.183v1.554a.3.3 0 0 0 .3.3h12.9a.3.3 0 0 0 .3-.3z" />
    </svg>
  )
);
IconSigma24.displayName = 'IconSigma24';
