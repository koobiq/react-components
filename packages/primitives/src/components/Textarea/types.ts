import type { ComponentRef, HTMLAttributes, ReactNode, Ref } from 'react';

export type TextareaProps = {
  children?: ReactNode;
  value?: string | number | readonly string[];
  ref?: Ref<HTMLTextAreaElement>;
} & HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export type TextareaRef = ComponentRef<'textarea'>;
