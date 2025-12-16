'use client';

import { useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

import { useMutableRef } from '../useMutableRef';

type UseEventListener<T, K, P> = {
  /** Event name, for example, "click". */
  eventName: T;
  /** A handler function that runs as soon as the event happens. */
  handler: K;
  /** The element to which the event will be attached. */
  element?: P;
  /** An additional object with properties. */
  options?: boolean | AddEventListenerOptions;
  /** An indicator of event handler activity, used to improve performance. */
  active?: boolean;
};

export function useEventListener<K extends keyof MediaQueryListEventMap>({
  eventName,
  handler,
  element,
  options,
  active,
}: UseEventListener<
  K,
  (event: MediaQueryListEventMap[K]) => void,
  RefObject<MediaQueryList>
>): void;

export function useEventListener<K extends keyof WindowEventMap>({
  eventName,
  handler,
  element,
  options,
  active,
}: UseEventListener<K, (event: WindowEventMap[K]) => void, undefined>): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>({
  eventName,
  handler,
  element,
  options,
  active,
}: UseEventListener<
  K,
  (event: HTMLElementEventMap[K]) => void,
  RefObject<T | null>
>): void;

export function useEventListener<K extends keyof DocumentEventMap>({
  eventName,
  handler,
  element,
  options,
  active,
}: UseEventListener<
  K,
  (event: DocumentEventMap[K]) => void,
  RefObject<Document>
>): void;

export function useEventListener({
  eventName,
  handler,
  element,
  options,
  active,
}: UseEventListener<
  string,
  (event: Event | CustomEvent) => void,
  RefObject<Document | HTMLElement | Window> | undefined
>): void;

/** A hook that adds event listeners and removes them on unmount. */
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement | MediaQueryList,
>({
  eventName,
  handler,
  element,
  options,
  active = true,
}: UseEventListener<
  KW | KH | KM | KD | string,
  (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | DocumentEventMap[KD]
      | Event
  ) => void,
  RefObject<T | null> | undefined
>): void {
  const savedListener = useMutableRef<typeof handler>(handler);

  const handleEventListener: typeof handler = useCallback((event) => {
    savedListener.current?.(event);
  }, []);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const targetElement: T | Window = element?.current ?? window;

    targetElement?.addEventListener(eventName, handleEventListener, options);

    return () => {
      targetElement?.removeEventListener(
        eventName,
        handleEventListener,
        options
      );
    };
  }, [eventName, element, options, active]);
}
