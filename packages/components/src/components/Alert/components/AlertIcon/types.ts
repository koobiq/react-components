import type { AlertBaseProps } from '../../index';

export type AlertIconProps = Pick<
  AlertBaseProps,
  'status' | 'icon' | 'isCompact'
>;
