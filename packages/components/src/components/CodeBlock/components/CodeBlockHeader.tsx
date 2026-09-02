'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { mergeProps } from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';

import s from '../CodeBlock.module.css';

export type CodeBlockHeaderSlotProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children'
>;

export type CodeBlockHeaderProps = {
  /** Whether the code content is scrolled away from its top, which casts a shadow under the header. */
  isScrolled: boolean;
  children?: ReactNode;
  slotProps?: CodeBlockHeaderSlotProps;
};

/**
 * Props of the header band, shared by both headers: the plain one below and the one `Tabs` renders
 * for `CodeBlockTabs`.
 */
export function getCodeBlockHeaderProps(
  isScrolled: boolean,
  slotProps?: CodeBlockHeaderSlotProps
) {
  return mergeProps(
    {
      className: s.header,
      'data-testid': 'code-block-header',
      'data-scrolled': isScrolled || undefined,
    } satisfies ComponentPropsWithRef<'div'> & DataAttributeProps,
    slotProps
  );
}

/** The header band of a `CodeBlock` without tabs — with them it comes from `CodeBlockTabs`. */
export function CodeBlockHeader(props: CodeBlockHeaderProps) {
  const { isScrolled, children, slotProps } = props;

  return (
    <div {...getCodeBlockHeaderProps(isScrolled, slotProps)}>{children}</div>
  );
}
