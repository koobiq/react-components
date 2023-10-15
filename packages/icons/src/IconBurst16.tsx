import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBurst16 = forwardRef(
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
        d="M8.923 5.018 5.22 1.033c-.067-.072-.188-.017-.176.081l.615 5.108-4.557-2.185c-.092-.044-.184.058-.131.144l2.73 4.45-3.613.556a.102.102 0 0 0-.033.19l4.299 2.265-2.92 1.616c-.093.05-.057.19.049.19h4.83l2.539 1.537a.1.1 0 0 0 .129-.019l1.902-2.12h3.704c.085 0 .133-.099.079-.165l-1.824-2.243 3.138-4.052a.102.102 0 0 0-.081-.163h-3.71l1.759-5.08c.034-.096-.082-.176-.161-.111z"
      />
    </svg>
  )
);
IconBurst16.displayName = 'IconBurst16';
