import type { ExtendableProps } from '@koobiq/react-core';

import type { UseProgressBarProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type ProgressBarRenderProps = {
  indeterminate?: boolean;
  percentage?: number;
};

export type ProgressBarBaseProps = ExtendableProps<
  RenderProps<ProgressBarRenderProps>,
  UseProgressBarProps
>;
