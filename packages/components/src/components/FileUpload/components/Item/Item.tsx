'use client';

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import type { ForwardedRef } from 'react';

import {
  clsx,
  mergeRefs,
  mergeProps,
  setRef,
  useHover,
  useFocusRing,
  useElementOverflow,
} from '@koobiq/react-core';
import { IconFileO16, IconCircleXmark16 } from '@koobiq/react-icons';
import { CollectionNode, createLeafComponent } from '@koobiq/react-primitives';
import type { Node } from '@react-types/shared';

import { IconButton } from '../../../IconButton';
import { Tooltip } from '../../../Tooltip';
import {
  FileUploadItemContext,
  useFileUploadContext,
  useFileUploadItemContext,
} from '../../FileUploadContext';
import { useMiddleEllipsis } from '../../hooks';
import type {
  FileUploadItemProps,
  FileUploadItemIconProps,
  FileUploadItemNameProps,
  FileUploadItemSizeProps,
  FileUploadItemContentProps,
  FileUploadRemoveButtonProps,
} from '../../types';
import { isAcceptedFile } from '../../utils';

import s from './Item.module.css';

class FileUploadItemNode extends CollectionNode<unknown> {
  static readonly type = 'item';
}

const toValidationErrors = (
  result: string | string[] | true | null | undefined
): string[] => {
  if (!result || result === true) return [];

  return Array.isArray(result) ? result : [result];
};

/** A single row in the file collection. */
export const FileUploadItem = createLeafComponent(
  FileUploadItemNode,
  function FileUploadItem(
    props: FileUploadItemProps,
    ref: ForwardedRef<HTMLDivElement>,
    node: Node<unknown>
  ) {
    const {
      children,
      className,
      style,
      file,
      isDisabled: isDisabledProp,
      isInvalid: isInvalidProp,
      'data-testid': testId,
      ...other
    } = props;

    const {
      accept,
      maxFileSize,
      validate,
      messages,
      allowsMultiple,
      isDisabled: groupDisabled,
      registerItemValidation,
      unregisterItemValidation,
    } = useFileUploadContext();

    const validationErrors = useMemo(() => {
      if (!file) return [];

      const errors: string[] = [];

      if (!isAcceptedFile(file, accept)) {
        errors.push(messages.unsupportedFileType);
      }

      if (maxFileSize !== undefined && file.size > maxFileSize) {
        errors.push(messages.fileSizeLimitExceeded);
      }

      return [...errors, ...toValidationErrors(validate?.(file))];
    }, [
      file,
      accept,
      maxFileSize,
      validate,
      messages.unsupportedFileType,
      messages.fileSizeLimitExceeded,
    ]);

    const isDisabled = groupDisabled || isDisabledProp || false;
    const isInvalid = Boolean(isInvalidProp || validationErrors.length > 0);
    delete other.id;
    delete other.textValue;

    useLayoutEffect(() => {
      registerItemValidation(
        node.key,
        node.textValue || file?.name || '',
        validationErrors
      );

      return () => unregisterItemValidation(node.key);
    }, [
      file,
      node.key,
      node.textValue,
      validationErrors,
      registerItemValidation,
      unregisterItemValidation,
    ]);

    const { hoverProps, isHovered } = useHover({ isDisabled });
    const { focusProps, isFocusVisible } = useFocusRing({ within: true });
    const rootRef = useRef<HTMLDivElement>(null);

    const contextValue = {
      id: node.key,
      nameText: node.textValue,
      isDisabled,
      isInvalid,
      rootRef,
    };

    return (
      <FileUploadItemContext.Provider value={contextValue}>
        <div
          {...mergeProps(other, hoverProps, focusProps)}
          ref={mergeRefs(ref, rootRef)}
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
        </div>
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
  const { nameText, rootRef } = useFileUploadItemContext();
  const fileName = typeof children === 'string' ? children : undefined;

  const middleEllipsis = useMiddleEllipsis<HTMLSpanElement>(fileName ?? '');
  const elementOverflow = useElementOverflow<HTMLSpanElement>();

  let displayedName = children;
  let isOverflowing = elementOverflow.isOverflowX;
  let overflowRef = elementOverflow.ref;

  if (fileName !== undefined) {
    displayedName = middleEllipsis.text;
    isOverflowing = middleEllipsis.isOverflow;
    overflowRef = middleEllipsis.ref;
  }

  return (
    <Tooltip
      isDisabled={!isOverflowing}
      placement="end"
      anchorRef={rootRef}
      control={({ ref: tooltipRef, ...tooltipProps }) => (
        <span
          {...mergeProps(other, tooltipProps)}
          ref={(element) => {
            setRef(ref, element);
            setRef(overflowRef, element);
            setRef(tooltipRef, element);
          }}
          style={style}
          data-testid={testId}
          data-overflowing={isOverflowing || undefined}
          className={clsx(s.name, className)}
        >
          {displayedName}
        </span>
      )}
    >
      {nameText ?? children}
    </Tooltip>
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
