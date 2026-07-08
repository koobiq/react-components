'use client';

import {
  clsx,
  isNotNil,
  mergeProps,
  useHover,
  useFocusRing,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import {
  IconFileO16,
  IconFolder16,
  IconCircleXmark16,
} from '@koobiq/react-icons';

import { IconButton } from '../../../IconButton';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadItemProps } from '../../types';
import { getItemName, getItemSize } from '../../utils';

import s from './Item.module.css';

/** A single row in the file list: icon, name, size, and a remove button. */
export const FileUploadItem = polymorphicForwardRef<'li', FileUploadItemProps>(
  (props, ref) => {
    const {
      item,
      as: Tag = 'li',
      children,
      className,
      style,
      'data-testid': testId,
      ...other
    } = props;

    const {
      messages,
      formatSize,
      removeItem,
      getItemRef,
      showFileSize,
      allowsMultiple,
      isDisabled: groupDisabled,
    } = useFileUploadContext();

    const isDisabled = groupDisabled || item.isDisabled || false;
    const isInvalid = isNotNil(item.errorMessage);
    const isLoading = item.isLoading || false;

    const { hoverProps, isHovered } = useHover({ isDisabled });
    const { focusProps, isFocusVisible } = useFocusRing({ within: true });

    const name = getItemName(item);
    const size = getItemSize(item);

    const defaultIcon =
      item.type === 'folder' ? <IconFolder16 /> : <IconFileO16 />;

    const icon = isLoading ? (
      <ProgressSpinner
        size="compact"
        value={item.progress}
        aria-label={messages.uploadingLabel}
        isIndeterminate={item.progress === undefined}
      />
    ) : (
      (item.icon ?? defaultIcon)
    );

    return (
      <Tag
        {...mergeProps(other, hoverProps, focusProps)}
        ref={ref}
        style={style}
        data-testid={testId}
        data-loading={isLoading || undefined}
        data-invalid={isInvalid || undefined}
        data-multiple={allowsMultiple || undefined}
        data-hovered={isHovered || undefined}
        data-disabled={isDisabled || undefined}
        data-focus-visible={isFocusVisible || undefined}
        className={clsx(s.base, className)}
      >
        <span className={s.icon} aria-hidden={isLoading ? undefined : true}>
          {icon}
        </span>
        <span className={s.content}>
          {children ?? (
            <>
              <span className={s.name}>{name}</span>
              {showFileSize && isNotNil(size) && (
                <span className={s.size}>{formatSize(size)}</span>
              )}
            </>
          )}
        </span>
        <IconButton
          size="l"
          className={s.remove}
          isDisabled={isDisabled}
          variant={isInvalid ? 'error' : 'fade-contrast'}
          aria-label={`${messages.removeButtonLabel} ${name}`.trim()}
          ref={getItemRef(item.id)}
          onPress={() => removeItem(item.id)}
          onKeyDown={(event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
              event.preventDefault();
              removeItem(item.id);
            }
          }}
        >
          <IconCircleXmark16 />
        </IconButton>
      </Tag>
    );
  }
);

FileUploadItem.displayName = 'FileUpload.Item';
