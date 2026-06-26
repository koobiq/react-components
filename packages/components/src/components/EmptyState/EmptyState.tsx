'use client';

import { useMemo } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import {
  EmptyStateActions,
  EmptyStateContent,
  EmptyStateMedia,
  EmptyStateTitle,
} from './components';
import s from './EmptyState.module.css';
import { EmptyStateContext } from './EmptyStateContext';
import type { EmptyStateBaseProps } from './types';

const EmptyStateComponent = polymorphicForwardRef<'div', EmptyStateBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      size = 'normal',
      isInvalid = false,
      align = 'center',
      className,
      children,
      ...other
    } = props;

    const contextValue = useMemo(
      () => ({ size, isInvalid, align }),
      [size, isInvalid, align]
    );

    return (
      <EmptyStateContext.Provider value={contextValue}>
        <Tag
          {...other}
          ref={ref}
          className={clsx(s.base, className)}
          data-size={size}
          data-align={align}
          data-invalid={isInvalid || undefined}
        >
          {children}
        </Tag>
      </EmptyStateContext.Provider>
    );
  }
);

EmptyStateComponent.displayName = 'EmptyState';

type CompoundedComponent = typeof EmptyStateComponent & {
  Media: typeof EmptyStateMedia;
  Title: typeof EmptyStateTitle;
  Content: typeof EmptyStateContent;
  Actions: typeof EmptyStateActions;
};

/**
 * EmptyState communicates that there is no data to display and, optionally,
 * suggests the next action the user can take.
 */
export const EmptyState = EmptyStateComponent as CompoundedComponent;

EmptyState.Media = EmptyStateMedia;
EmptyState.Title = EmptyStateTitle;
EmptyState.Content = EmptyStateContent;
EmptyState.Actions = EmptyStateActions;
