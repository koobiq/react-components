'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useMemo } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import {
  EmptyStateActions,
  EmptyStateContent,
  EmptyStateMedia,
  EmptyStateTitle,
} from './components';
import s from './EmptyState.module.css';
import { EmptyStateContext } from './EmptyStateContext';
import type { EmptyStateBaseProps } from './types';

const EmptyStateComponent = forwardRef<HTMLDivElement, EmptyStateBaseProps>(
  (props, ref) => {
    const {
      size = 'normal',
      state = 'default',
      className,
      children,
      ...other
    } = props;

    const contextValue = useMemo(() => ({ size, state }), [size, state]);

    const rootProps = mergeProps<ComponentPropsWithRef<'div'>[]>(
      { className: clsx(s.base, className) },
      other
    );

    return (
      <EmptyStateContext.Provider value={contextValue}>
        <div {...rootProps} ref={ref} data-size={size} data-state={state}>
          {children}
        </div>
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
