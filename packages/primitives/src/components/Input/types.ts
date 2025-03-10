import type { ComponentRef, HTMLAttributes, ReactNode, Ref } from 'react';

export type InputProps = {
  children?: ReactNode;
  value?: string | number | readonly string[];
  ref?: Ref<HTMLInputElement>;
} & HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export type InputRef = ComponentRef<'input'>;
