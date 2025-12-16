import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderBadgeArrowRight16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M1 3.2A1.2 1.2 0 0 1 2.2 2H5l1.8 1.8H1zM1 5v7.8A1.2 1.2 0 0 0 2.197 14H6.8v-2.25c0-.11.09-.2.2-.2h3.5V9.054a.2.2 0 0 1 .303-.172L15 11.407V6.2A1.2 1.2 0 0 0 13.8 5zm14.904 8.336a.187.187 0 0 1 0 .328l-3.91 2.306c-.136.08-.312-.012-.312-.163v-1.535H8.204c-.112 0-.204-.086-.204-.193v-1.158a.2.2 0 0 1 .205-.193h3.477v-1.535c0-.151.176-.244.313-.163z" />
    </svg>
  )
);
IconFolderBadgeArrowRight16.displayName = 'IconFolderBadgeArrowRight16';
