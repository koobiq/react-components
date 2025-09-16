'use client';

import type { Node } from '@koobiq/react-core';
import type { TreeState } from '@koobiq/react-primitives';
import { useMenuSection } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Typography } from '../../../Typography';
import { MenuItem } from '../MenuItem';

const { listHeading } = utilClasses;

export type MenuSectionProps<T> = {
  section: Node<T>;
  state: TreeState<T>;
};

export function MenuSection<T>({ section, state }: MenuSectionProps<T>) {
  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  return (
    <li {...itemProps}>
      {section.rendered && (
        <Typography
          as="span"
          display="block"
          variant="caps-compact-strong"
          color="contrast-secondary"
          className={listHeading}
          {...headingProps}
        >
          {section.rendered}
        </Typography>
      )}
      <ul {...groupProps}>
        {[...section.childNodes].map((node) => (
          <MenuItem key={node.key} item={node} state={state} />
        ))}
      </ul>
    </li>
  );
}
