import type { AlertBaseProps } from '../../index';

export type AlertIconProps = Pick<
  AlertBaseProps,
  'status' | 'compact' | 'icon'
>;
