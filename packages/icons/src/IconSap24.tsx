import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSap24 = forwardRef(
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
        d="M19.377 7.196h-3.002a.3.3 0 0 0-.3.3l.01 7.117-2.801-7.228a.3.3 0 0 0-.28-.192h-2.442a.3.3 0 0 0-.279.19l-2.38 6.007c-.26-1.577-1.967-2.12-3.31-2.528-.888-.273-1.829-.673-1.82-1.115.008-.363.504-.7 1.49-.65.614.032 1.16.078 2.163.512.14.06.306.01.385-.12l.836-1.392a.29.29 0 0 0-.13-.416 9.4 9.4 0 0 0-3.43-.706H4.08c-1.402 0-2.569.433-3.292 1.147a2.6 2.6 0 0 0-.787 1.834c-.019.965.351 1.648 1.13 2.195.656.46 1.497.758 2.238.977.913.27 1.66.506 1.65 1.006a.73.73 0 0 1-.217.491c-.228.225-.577.309-1.06.318-.854.017-1.505-.098-2.454-.595a.31.31 0 0 0-.415.125l-.735 1.392a.29.29 0 0 0 .125.399c1.023.506 2.11.76 3.332.76l.298-.002c1.155-.02 2.093-.284 2.837-.856q.063-.05.12-.099l-.05.254a.3.3 0 0 0 .294.36l2.217-.007a.3.3 0 0 0 .277-.186l.424-1.037a5.7 5.7 0 0 0 1.758.266c.618 0 1.2-.09 1.715-.251l.286.991a.3.3 0 0 0 .288.217l4.475.004a.3.3 0 0 0 .3-.299l.011-2.487h1.064c2.571 0 4.09-1.25 4.09-3.346 0-2.334-1.477-3.35-4.622-3.35m-7.607 6.34c-.384 0-.745-.063-1.054-.176l1.042-3.143h.02l1.026 3.152c-.309.105-.66.167-1.034.167m7.8-1.806h-.726V9.197h.726c.967 0 1.739.307 1.739 1.25-.001.976-.772 1.283-1.74 1.283"
      />
    </svg>
  )
);
IconSap24.displayName = 'IconSap24';
