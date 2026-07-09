'use client';

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from 'react';
import type { ReactNode, ReactElement } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import {
  IconCloudArrowUpO24,
  IconArrowUpFromBracket16,
} from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import { useFileUploadContext } from '../../FileUploadContext';
import type {
  FileUploadEmptyProps,
  FileUploadEmptyIconProps,
  FileUploadEmptyTitleProps,
  FileUploadEmptyDescriptionProps,
} from '../../types';
import { FileUploadTrigger } from '../Trigger';

import s from './Empty.module.css';

type EmptyVariant = 'large' | 'compact';

const EmptyVariantContext = createContext<EmptyVariant>('compact');

type EmptySlots = {
  icon?: ReactElement;
  title?: ReactElement;
  description?: ReactElement;
  rest: ReactNode[];
};

const isSlot = (child: ReactNode, slot: unknown): child is ReactElement =>
  isValidElement(child) && child.type === slot;

const getSlots = (children: ReactNode): EmptySlots => {
  const slots: EmptySlots = { rest: [] };

  Children.forEach(children, (child) => {
    if (isSlot(child, FileUploadEmptyIcon)) {
      slots.icon ??= child;
    } else if (isSlot(child, FileUploadEmptyTitle)) {
      slots.title ??= child;
    } else if (isSlot(child, FileUploadEmptyDescription)) {
      slots.description ??= child;
    } else {
      slots.rest.push(child);
    }
  });

  return slots;
};

const withClassName = (
  child: ReactElement,
  className: string
): ReactElement => {
  const props = child.props as { className?: string };

  return cloneElement(child, {
    className: clsx(className, props.className),
  } as object);
};

export const FileUploadEmpty = forwardRef<HTMLDivElement, FileUploadEmptyProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      'data-testid': testId,
      ...other
    } = props;

    const { size, isDisabled, allowsMultiple } = useFileUploadContext();
    const domRef = useDOMRef<HTMLDivElement>(ref);

    const variant: EmptyVariant =
      allowsMultiple && size === 'default' ? 'large' : 'compact';

    const slots = getSlots(children);

    const icon = slots.icon ?? <FileUploadEmptyIcon />;

    const title =
      slots.title ??
      (variant === 'large' ? <FileUploadEmptyTitle /> : undefined);

    const description = slots.description ?? <FileUploadEmptyDescription />;

    if (variant === 'large') {
      return (
        <div
          {...other}
          ref={domRef}
          style={style}
          data-size={size}
          data-testid={testId}
          data-disabled={isDisabled || undefined}
          data-multiple={allowsMultiple || undefined}
          data-variant={variant}
          className={clsx(s.empty, className)}
        >
          <EmptyVariantContext.Provider value={variant}>
            <EmptyState size="normal" className={s.large}>
              {withClassName(icon, s.icon)}
              {title && withClassName(title, s.title)}
              {withClassName(description, s.description)}
              {slots.rest}
            </EmptyState>
          </EmptyVariantContext.Provider>
        </div>
      );
    }

    return (
      <div
        {...other}
        ref={domRef}
        style={style}
        data-size={size}
        data-testid={testId}
        data-disabled={isDisabled || undefined}
        data-multiple={allowsMultiple || undefined}
        data-variant={variant}
        className={clsx(s.empty, s.compact, className)}
      >
        <EmptyVariantContext.Provider value={variant}>
          {withClassName(icon, s.icon)}
          <span className={s.compactText}>
            {title && withClassName(title, s.title)}
            {withClassName(description, s.description)}
            {slots.rest}
          </span>
        </EmptyVariantContext.Provider>
      </div>
    );
  }
);

export const FileUploadEmptyIcon = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyIconProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const variant = useContext(EmptyVariantContext);

  const content =
    children ??
    (variant === 'large' ? (
      <IconCloudArrowUpO24 />
    ) : (
      <IconArrowUpFromBracket16 />
    ));

  if (variant === 'large') {
    return (
      <EmptyState.Media
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={className}
      >
        {content}
      </EmptyState.Media>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={className}
      aria-hidden="true"
    >
      {content}
    </span>
  );
});

export const FileUploadEmptyTitle = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyTitleProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();
  const variant = useContext(EmptyVariantContext);
  const content = children ?? messages.dropTitle;

  if (variant === 'large') {
    return (
      <EmptyState.Title
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={className}
      >
        {content}
      </EmptyState.Title>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={className}
    >
      {content}
    </span>
  );
});

export const FileUploadEmptyDescription = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyDescriptionProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();
  const variant = useContext(EmptyVariantContext);

  const content =
    children ??
    (variant === 'large' ? (
      <>
        {messages.or} <FileUploadTrigger />
      </>
    ) : (
      <>
        {messages.dropHere} {messages.or} <FileUploadTrigger />
      </>
    ));

  if (variant === 'large') {
    return (
      <EmptyState.Content
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={className}
      >
        {content}
      </EmptyState.Content>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={className}
    >
      {content}
    </span>
  );
});

FileUploadEmpty.displayName = 'FileUpload.Empty';
FileUploadEmptyIcon.displayName = 'FileUpload.EmptyIcon';
FileUploadEmptyTitle.displayName = 'FileUpload.EmptyTitle';
FileUploadEmptyDescription.displayName = 'FileUpload.EmptyDescription';
