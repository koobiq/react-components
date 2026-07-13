'use client';

import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';

import {
  clsx,
  mergeRefs,
  mergeProps,
  useHover,
  useFocusRing,
} from '@koobiq/react-core';
import { IconFileO16, IconCircleXmark16 } from '@koobiq/react-icons';
import { CollectionNode, createLeafComponent } from '@koobiq/react-primitives';
import type { Node } from '@react-types/shared';

import { IconButton } from '../../../IconButton';
import {
  FileUploadItemContext,
  useFileUploadContext,
  useFileUploadItemContext,
} from '../../FileUploadContext';
import type {
  FileUploadItemProps,
  FileUploadItemIconProps,
  FileUploadItemNameProps,
  FileUploadItemSizeProps,
  FileUploadItemContentProps,
  FileUploadRemoveButtonProps,
} from '../../types';

import s from './Item.module.css';

class FileUploadItemNode extends CollectionNode<unknown> {
  static readonly type = 'item';
}

/** A single row in the file collection. */
export const FileUploadItem = createLeafComponent(
  FileUploadItemNode,
  function FileUploadItem(
    props: FileUploadItemProps,
    ref: ForwardedRef<HTMLLIElement>,
    node: Node<unknown>
  ) {
    const {
      children,
      className,
      style,
      isDisabled: isDisabledProp,
      isInvalid: isInvalidProp,
      'data-testid': testId,
      ...other
    } = props;

    const { allowsMultiple, isDisabled: groupDisabled } =
      useFileUploadContext();

    const isDisabled = groupDisabled || isDisabledProp || false;
    const isInvalid = isInvalidProp || false;
    delete other.id;
    delete other.textValue;

    const { hoverProps, isHovered } = useHover({ isDisabled });
    const { focusProps, isFocusVisible } = useFocusRing({ within: true });

    const contextValue = {
      id: node.key,
      nameText: node.textValue,
      isDisabled,
      isInvalid,
    };

    return (
      <FileUploadItemContext.Provider value={contextValue}>
        <li
          {...mergeProps(other, hoverProps, focusProps)}
          ref={ref}
          style={style}
          data-testid={testId}
          data-invalid={isInvalid || undefined}
          data-multiple={allowsMultiple || undefined}
          data-hovered={isHovered || undefined}
          data-disabled={isDisabled || undefined}
          data-focus-visible={isFocusVisible || undefined}
          className={clsx(s.base, className)}
        >
          {children}
        </li>
      </FileUploadItemContext.Provider>
    );
  }
);

export const FileUploadItemIcon = forwardRef<
  HTMLSpanElement,
  FileUploadItemIconProps
>((props, ref) => {
  const {
    children,
    className,
    style,
    'aria-hidden': ariaHidden,
    'data-testid': testId,
    ...other
  } = props;

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.icon, className)}
      aria-hidden={ariaHidden ?? (children == null ? true : undefined)}
    >
      {children ?? <IconFileO16 />}
    </span>
  );
});

export const FileUploadItemContent = forwardRef<
  HTMLSpanElement,
  FileUploadItemContentProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.content, className)}
    >
      {children}
    </span>
  );
});

export const FileUploadItemName = forwardRef<
  HTMLSpanElement,
  FileUploadItemNameProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.name, className)}
    >
      {children}
    </span>
  );
});

export const FileUploadItemSize = forwardRef<
  HTMLSpanElement,
  FileUploadItemSizeProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { formatSize } = useFileUploadContext();

  if (children === undefined || children === null) return null;

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.size, className)}
    >
      {typeof children === 'number' ? formatSize(children) : children}
    </span>
  );
});

export const FileUploadRemoveButton = forwardRef<
  HTMLButtonElement,
  FileUploadRemoveButtonProps
>((props, ref) => {
  const {
    children,
    className,
    onPress,
    onKeyDown,
    'aria-label': ariaLabel,
    ...other
  } = props;

  const { messages, removeItem, getItemRef } = useFileUploadContext();
  const { id, nameText, isDisabled, isInvalid } = useFileUploadItemContext();

  const removeLabel =
    ariaLabel ?? `${messages.removeButtonLabel} ${nameText ?? ''}`.trim();

  return (
    <IconButton
      {...other}
      size="l"
      className={clsx(s.remove, className)}
      isDisabled={isDisabled}
      variant={isInvalid ? 'error' : 'fade-contrast'}
      aria-label={removeLabel}
      ref={mergeRefs(ref, getItemRef(id))}
      onPress={(event) => {
        onPress?.(event);
        removeItem(id);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) return;

        if (event.key === 'Delete' || event.key === 'Backspace') {
          event.preventDefault();
          removeItem(id);
        }
      }}
    >
      {children ?? <IconCircleXmark16 />}
    </IconButton>
  );
});

(FileUploadItem as { displayName?: string }).displayName = 'FileUpload.Item';
FileUploadItemIcon.displayName = 'FileUpload.ItemIcon';
FileUploadItemContent.displayName = 'FileUpload.ItemContent';
FileUploadItemName.displayName = 'FileUpload.ItemName';
FileUploadItemSize.displayName = 'FileUpload.ItemSize';
FileUploadRemoveButton.displayName = 'FileUpload.RemoveButton';
