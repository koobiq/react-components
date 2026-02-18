'use client';

import {
  clsx,
  isNumber,
  isString,
  mergeProps,
  mergeRefs,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconEllipsisVertical16 } from '@koobiq/react-icons';

import { Badge } from '../../../Badge';
import { Button } from '../../../Button';
import { Menu, type MenuPropControl } from '../../../Menu';
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
    selectedExtraCount,
    ...other
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const isAll = selectedItemCount === 'all';
  const hasItems = collapsedItems.length > 0;

  const renderButton: MenuPropControl = ({
    ref: controlRef,
    ...controlProps
  }) => (
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
  );

  if (!hasItems) {
    return renderButton({});
  }

  return (
    <Menu onAction={onAction} control={(props) => renderButton(props)}>
      <Menu.Header>
        <Typography variant="text-normal-strong" className={s.menuTitle}>
          {isAll ? (
            t.format('all selected')
          ) : (
            <>
              {t.format('selected')}&nbsp;{selectedItemCount}
            </>
          )}
          {isNumber(selectedExtraCount) && (
            <Badge variant="fade-contrast" className={s.extraCounter}>
              +{selectedExtraCount}
            </Badge>
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
