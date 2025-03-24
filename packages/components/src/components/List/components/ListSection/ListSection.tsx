'use client';

import { useListBoxSection } from '@koobiq/react-primitives';
import type { ListState, Node } from '@koobiq/react-primitives';

import { Typography } from '../../../Typography';
import { ListOption } from '../ListOption';

import s from './ListSection.module.css';

export function ListSection<T>({
  section,
  state,
}: {
  section: Node<T>;
  state: ListState<T>;
}) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  return (
    <>
      <li {...itemProps}>
        {section.rendered && (
          <Typography
            as="span"
            display="block"
            variant="caps-compact-strong"
            color="contrast-secondary"
            className={s.heading}
            {...headingProps}
          >
            {section.rendered}
          </Typography>
        )}
        <ul {...groupProps} className={s.base}>
          {[...section.childNodes].map((node) => (
            <ListOption key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}
