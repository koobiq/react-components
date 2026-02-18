'use client';

import {
  clsx,
  isString,
  mergeProps,
  mergeRefs,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconEllipsisVertical16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';
import { Menu } from '../../../Menu';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl.json';

import s from './ActionsPanelMoreAction.module.css';
import type { ActionsPanelMoreActionProps } from './types';

export const ActionsPanelMoreAction = (props: ActionsPanelMoreActionProps) => {
  const {
    ref,
    onAction,
    children,
    className,
    collapsedItems,
    selectedItemCount,
    ...other
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const isAll = selectedItemCount === 'all';

  return (
    <Menu
      onAction={onAction}
      control={({ ref: controlRef, ...controlProps }) => (
        <Button
          data-slot="more-action"
          ref={mergeRefs(ref, controlRef)}
          aria-label={t.format('show more actions')}
          className={clsx(s.base, className)}
          startIcon={<IconEllipsisVertical16 />}
          {...mergeProps(other, controlProps)}
          onlyIcon
        >
          {children}
        </Button>
      )}
    >
      <Menu.Header>
        <Typography variant="text-normal-strong" className={s.menuTitle}>
          {isAll ? (
            t.format('all selected')
          ) : (
            <>
              {t.format('selected')}&nbsp;{selectedItemCount}
            </>
          )}
        </Typography>
      </Menu.Header>
      <Menu.Divider />
      <>
        {collapsedItems.map((item, index) => (
          <Menu.Item
            key={item.key}
            textValue={isString(item.children) ? item.children : `${index}`}
          >
            {item.props.startIcon}
            <Menu.ItemText>{item.children}</Menu.ItemText>
          </Menu.Item>
        ))}
      </>
    </Menu>
  );
};
