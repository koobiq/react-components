import type { Context } from 'react';
import { useContext } from 'react';

import { mergeProps } from '@koobiq/react-core';

// TODO: remove this and switch to useContextProps.
export function useSlottedContext<
  PROPS extends object,
  CONTEXT extends Context<{ slots?: Record<string, any> }>,
>(props: PROPS, context: CONTEXT, slot: string | undefined): PROPS {
  const slotContext = useContext(context);

  if (!slot) return props;

  const propsContext = slotContext.slots?.[slot];

  return mergeProps(propsContext, props);
}
