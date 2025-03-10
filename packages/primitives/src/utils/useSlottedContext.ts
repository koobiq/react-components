import type { Context } from 'react';
import { useContext } from 'react';

import { mergeProps } from '@koobiq/react-core';

export function useSlottedContext<
  PROPS extends object,
  CONTEXT extends Context<{ slots?: Record<string, any> }>,
>(props: PROPS, context: CONTEXT, slot: string | undefined): PROPS {
  const slotContext = useContext(context);

  if (!slot) return props;

  const propsContext = slotContext.slots?.[slot];

  return mergeProps(props, propsContext);
}
