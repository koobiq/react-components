import type { ComponentRef, HTMLAttributes, ReactNode } from 'react';

export type TextareaProps = {
  children?: ReactNode;
  value?: string | number | readonly string[];
} & HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export type TextareaRef = ComponentRef<'textarea'>;
