import type {
  JSX,
  CSSProperties,
  ReactNode,
  Context,
  ForwardedRef,
} from 'react';
import { useMemo, useContext } from 'react';

import type {
  AriaLabelingProps,
  DOMProps as SharedDOMProps,
  RefObject,
} from '@koobiq/react-core';
import {
  isNotNil,
  mergeProps,
  mergeRefs,
  useObjectRef,
} from '@koobiq/react-core';

export const DEFAULT_SLOT = Symbol('default');

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>;
}

export interface SlotProps {
  /**
   * A slot name for the component. Slots allow the component to receive props from a parent component.
   * An explicit `null` value indicates that the local props completely override all props received from a parent.
   */
  slot?: string | null;
}

export type WithRef<T, E> = T & { ref?: ForwardedRef<E> };

export type SlottedContextValue<T> = SlottedValue<T> | T | null | undefined;
export type ContextValue<T, E> = SlottedContextValue<WithRef<T, E>>;

export interface StyleProps {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. */
  className?: string;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. */
  style?: CSSProperties;
}

export interface DOMProps extends StyleProps, SharedDOMProps {
  /** The children of the component. */
  children?: ReactNode;
}

export interface StyleRenderProps<T> {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?:
    | string
    | ((values: T & { defaultClassName: string | undefined }) => string);
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?:
    | CSSProperties
    | ((
        values: T & { defaultStyle: CSSProperties }
      ) => CSSProperties | undefined);
}

export interface RenderProps<T> extends StyleRenderProps<T> {
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children?:
    | ReactNode
    | ((values: T & { defaultChildren: ReactNode | undefined }) => ReactNode);
}

interface RenderPropsHookOptions<T>
  extends RenderProps<T>,
    SharedDOMProps,
    AriaLabelingProps {
  values: T;
  defaultChildren?: ReactNode;
  defaultClassName?: string;
  defaultStyle?: CSSProperties;
}

export type UserRenderPropsReturn = {
  className: string | undefined;
  style: CSSProperties | undefined;
  children: ReactNode | undefined;
};

export function useRenderProps<T>(
  props: RenderPropsHookOptions<T>
): UserRenderPropsReturn {
  const {
    className,
    style,
    children,
    defaultClassName = undefined,
    defaultChildren = undefined,
    defaultStyle,
    values,
  } = props;

  return useMemo(() => {
    let computedClassName: string | undefined;
    let computedStyle: CSSProperties | undefined;
    let computedChildren: ReactNode | undefined;

    if (typeof className === 'function') {
      computedClassName = className({ ...values, defaultClassName });
    } else {
      computedClassName = className;
    }

    if (typeof style === 'function') {
      computedStyle = style({ ...values, defaultStyle: defaultStyle || {} });
    } else {
      computedStyle = style;
    }

    if (typeof children === 'function') {
      computedChildren = children({ ...values, defaultChildren });
    } else if (children == null) {
      computedChildren = defaultChildren;
    } else {
      computedChildren = children;
    }

    return {
      className: computedClassName ?? defaultClassName,
      style:
        computedStyle || defaultStyle
          ? { ...defaultStyle, ...computedStyle }
          : undefined,
      children: computedChildren ?? defaultChildren,
    };
  }, [
    className,
    style,
    children,
    defaultClassName,
    defaultChildren,
    defaultStyle,
    values,
  ]);
}

type ProviderValue<T> = [Context<T>, T];
type ProviderValues<T extends unknown[]> = {
  [K in keyof T]: ProviderValue<T[K]>;
};

interface ProviderProps<T extends unknown[]> {
  values: ProviderValues<T>;
  children: ReactNode;
}

export function Provider<T extends unknown[]>({
  values,
  children,
}: ProviderProps<T>): JSX.Element {
  return values.reduceRight(
    (acc, [Context, value]) => (
      <Context.Provider value={value}>{acc}</Context.Provider>
    ),
    children as JSX.Element
  );
}

export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  const filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}

export function useSlottedContext<T>(
  context: Context<SlottedContextValue<T>>,
  slot?: string | null
): T | null | undefined {
  const ctx = useContext(context);

  if (!isNotNil(slot)) {
    return null;
  }

  if (ctx && typeof ctx === 'object' && 'slots' in ctx && ctx.slots) {
    const slotKey = slot || DEFAULT_SLOT;

    if (!ctx.slots[slotKey]) {
      const availableSlots = new Intl.ListFormat().format(
        Object.keys(ctx.slots).map((p) => `"${p}"`)
      );

      const errorMessage = slot
        ? `Invalid slot "${slot}".`
        : 'A slot prop is required.';

      throw new Error(
        `${errorMessage} Valid slot names are ${availableSlots}.`
      );
    }

    return ctx.slots[slotKey];
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return ctx;
}

export function useContextProps<T, U extends SlotProps, E extends Element>(
  props: T & SlotProps,
  ref: ForwardedRef<E> | undefined,
  context: Context<ContextValue<U, E>>
): [T, RefObject<E | null>] {
  const ctx = useSlottedContext(context, props.slot) || {};
  const { ref: contextRef, ...contextProps } = ctx as any;

  const mergedRef = useObjectRef(
    useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef])
  );

  const mergedProps = mergeProps(contextProps, props) as unknown as T;

  // mergeProps does not merge `style`. Adding this there might be a breaking change.
  if (
    'style' in contextProps &&
    contextProps.style &&
    'style' in props &&
    props.style
  ) {
    if (
      typeof contextProps.style === 'function' ||
      typeof props.style === 'function'
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mergedProps.style = (renderProps) => {
        const contextStyle =
          typeof contextProps.style === 'function'
            ? contextProps.style(renderProps)
            : contextProps.style;

        const defaultStyle = { ...renderProps.defaultStyle, ...contextStyle };

        const style =
          typeof props.style === 'function'
            ? props.style({ ...renderProps, defaultStyle })
            : props.style;

        return { ...defaultStyle, ...style };
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mergedProps.style = { ...contextProps.style, ...props.style };
    }
  }

  return [mergedProps, mergedRef];
}
