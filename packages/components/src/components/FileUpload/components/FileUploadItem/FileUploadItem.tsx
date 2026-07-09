'use client';

import { forwardRef, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import {
  clsx,
  mergeRefs,
  useIsomorphicEffect,
  useResizeObserver,
} from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Tooltip } from '../../../Tooltip';
import { useFileUploadItem } from '../../hooks/useFileUploadItem';
import type { FileItem, FileUploadProgressMode } from '../../types';
import { centerEllipsisParts } from '../../utils';

import s from './FileUploadItem.module.css';

export interface FileUploadItemProps {
  /** The file to render. */
  item: FileItem;
  /** Whether interaction is disabled. */
  isDisabled?: boolean;
  /** Row-level error state (drives error color on the name and remove button). */
  hasError?: boolean;
  /** Formatted size string; when omitted the size cell is hidden. */
  size?: string;
  /** Leading icon shown when not loading. */
  icon?: ReactNode;
  /** Progress indicator mode. @default 'determinate' */
  progressMode?: FileUploadProgressMode;
  /** Accessible label for the remove button. */
  removeLabel: string;
  /** Called to remove this item. */
  onRemove: () => void;
}

/** Presentational row: leading icon/spinner, center-ellipsized name, optional size, remove button. */
export const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  (props, ref) => {
    const {
      item,
      isDisabled,
      hasError,
      size,
      icon,
      progressMode = 'determinate',
      removeLabel,
      onRemove,
    } = props;

    const { isLoading, progress } = useFileUploadItem(item);
    const name = item.file.name;
    const { head, tail } = centerEllipsisParts(name);

    // Center-ellipsis truncates the head span; mirror the Angular
    // `KbqEllipsisCenterDirective`, which shows the full name in a tooltip only
    // while the name actually overflows. Observe the name box and re-measure the
    // head's overflow whenever its width changes.
    const headRef = useRef<HTMLSpanElement>(null);
    const [nameRef, nameRect] = useResizeObserver<HTMLSpanElement>();
    const [isTruncated, setIsTruncated] = useState(false);

    useIsomorphicEffect(() => {
      const el = headRef.current;

      setIsTruncated(!!el && el.scrollWidth > el.clientWidth);
    }, [nameRect.width, name]);

    const isTooltipDisabled = isDisabled || !isTruncated;

    return (
      <div
        ref={ref}
        className={clsx(s.item, utilClasses.typography['text-normal'])}
        data-error={hasError || undefined}
        data-disabled={isDisabled || undefined}
      >
        <span className={s.leading}>
          {isLoading ? (
            <ProgressSpinner
              value={progress}
              isIndeterminate={progressMode === 'indeterminate'}
            />
          ) : (
            icon
          )}
        </span>
        <Tooltip
          isDisabled={isTooltipDisabled}
          control={({ ref: controlRef, ...controlProps }) => (
            <span
              {...controlProps}
              ref={mergeRefs<HTMLSpanElement>(nameRef, controlRef)}
              className={s.name}
              aria-label={name}
            >
              {head ? (
                <span ref={headRef} className={s.nameHead}>
                  {head}
                </span>
              ) : null}
              <span className={s.nameTail}>{tail}</span>
            </span>
          )}
        >
          {name}
        </Tooltip>
        {size != null ? <span className={s.size}>{size}</span> : null}
        <IconButton
          className={s.remove}
          isCompact
          size="l"
          variant={hasError ? 'error' : 'fade-contrast'}
          isDisabled={isDisabled}
          aria-label={removeLabel}
          onPress={onRemove}
          onKeyDown={(event) => {
            if (isDisabled) {
              return;
            }

            if (event.key === 'Backspace' || event.key === 'Delete') {
              event.preventDefault();
              onRemove();
            }
          }}
        >
          <IconCircleXmark16 />
        </IconButton>
      </div>
    );
  }
);

FileUploadItem.displayName = 'FileUploadItem';
