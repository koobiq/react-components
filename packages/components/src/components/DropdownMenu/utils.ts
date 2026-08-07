import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';

import { ListItemText } from '../List';

/**
 * Derives a `textValue` for a menu item from the first `ItemText` slot.
 *
 * React Aria only infers it from string children, so an item built out of slots
 * would get an empty one and break typeahead and search.
 */
export function getItemTextValue(children: ReactNode): string | undefined {
  if (typeof children === 'string') return children;

  let textValue: string | undefined;

  Children.forEach(children, (child) => {
    if (textValue !== undefined) return;

    if (!isValidElement<{ children?: ReactNode }>(child)) return;
    if (child.type !== ListItemText) return;

    const text = child.props.children;

    if (typeof text === 'string') textValue = text;
    else if (typeof text === 'number') textValue = String(text);
  });

  return textValue;
}
