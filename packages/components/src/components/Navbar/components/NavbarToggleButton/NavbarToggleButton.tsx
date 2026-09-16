'use client';

import { useLocale, useLocalizedStringFormatter } from '@koobiq/react-core';
import {
  IconChevronDoubleLeftS16,
  IconChevronDoubleRightS16,
} from '@koobiq/react-icons';
import { Button } from '@koobiq/react-primitives';

import intlMessages from '../../intl.json';
import { NavbarTooltip } from '../NavbarTooltip';

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
  const { direction } = useLocale();

  const label = stringFormatter.format(isCollapsed ? 'expand' : 'collapse');

  // The arrows point where the navbar edge moves.
  const Icon =
    isCollapsed === (direction === 'rtl')
      ? IconChevronDoubleLeftS16
      : IconChevronDoubleRightS16;

  return (
    <NavbarTooltip
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
            <Icon />
          </span>
        </Button>
      )}
    >
      {label}
    </NavbarTooltip>
  );
};

NavbarToggleButton.displayName = 'NavbarToggleButton';
