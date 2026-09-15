'use client';

import { useLocalizedStringFormatter } from '@koobiq/react-core';
import { IconChevronDoubleLeftS16 } from '@koobiq/react-icons';
import { Button } from '@koobiq/react-primitives';

import { Tooltip } from '../../../Tooltip';
import intlMessages from '../../intl.json';

import s from './NavbarToggleButton.module.css';

type NavbarToggleButtonProps = {
  isCollapsed: boolean;
  isShown: boolean;
  onPress: () => void;
};

export const NavbarToggleButton = ({
  isCollapsed,
  isShown,
  onPress,
}: NavbarToggleButtonProps) => {
  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const label = stringFormatter.format(
    isCollapsed ? 'show navbar' : 'hide navbar'
  );

  return (
    <Tooltip
      offset={8}
      hideArrow
      placement="end"
      control={(tooltipProps) => (
        <Button
          {...tooltipProps}
          aria-label={label}
          aria-expanded={!isCollapsed}
          data-collapsed={isCollapsed || undefined}
          data-shown={isShown || undefined}
          className={s.base}
          onPress={onPress}
        >
          <span className={s.button}>
            <IconChevronDoubleLeftS16 />
          </span>
        </Button>
      )}
    >
      {label}
    </Tooltip>
  );
};

NavbarToggleButton.displayName = 'NavbarToggleButton';
