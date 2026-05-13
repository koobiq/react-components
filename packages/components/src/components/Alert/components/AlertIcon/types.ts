import type { ComponentPropsWithRef } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

import type { AlertBaseProps } from '../../index';

export type AlertIconProps = Pick<
  AlertBaseProps,
  'status' | 'icon' | 'isCompact'
> &
  ComponentPropsWithRef<'div'> &
  DataAttributeProps;
