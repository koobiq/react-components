'use client';

import type { ReactNode } from 'react';

import {
  clsx,
  FocusScope,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconCloudArrowUpO24 } from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import intlMessages from '../../intl.json';
import type { DropzoneContentSize } from '../../types';

import s from './DropzoneContent.module.css';

export interface DropzoneContentProps {
  /** Title text; falls back to the localized default. */
  title?: string;
  /** Caption text or node rendered below the title. */
  caption?: ReactNode;
  /**
   * Visual size of the content.
   * @default 'normal'
   */
  size?: DropzoneContentSize;
  /**
   * Whether focus is captured into the overlay when it opens.
   * @default true
   */
  autoCapture?: boolean;
  /** Additional CSS-classes. */
  className?: string;
}

/**
 * The content shown inside a dropzone overlay: a cloud icon, a title, and an
 * optional caption. Traps focus while mounted (react-aria `FocusScope`).
 */
export const DropzoneContent = (props: DropzoneContentProps) => {
  const {
    title,
    caption,
    size = 'normal',
    autoCapture = true,
    className,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);
  const hasCaption = caption != null && caption !== '';

  return (
    <FocusScope contain autoFocus={autoCapture} restoreFocus>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus-trap target for the dropzone overlay (mirrors CdkTrapFocus autoCapture) */}
      <div tabIndex={0} className={clsx(s.content, className)}>
        <EmptyState size={size}>
          <EmptyState.Media>
            <IconCloudArrowUpO24 />
          </EmptyState.Media>
          <EmptyState.Title>
            {title ?? t.format('dropzoneTitle')}
          </EmptyState.Title>
          {hasCaption ? (
            <EmptyState.Content>{caption}</EmptyState.Content>
          ) : null}
        </EmptyState>
      </div>
    </FocusScope>
  );
};

DropzoneContent.displayName = 'DropzoneContent';
