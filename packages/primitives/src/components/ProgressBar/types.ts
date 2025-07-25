import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaProgressBarProps } from '@react-aria/progress';

import type { RenderProps } from '../../utils';

export type ProgressBarRenderProps = {
  percentage?: number;
};

export type ProgressBarBaseProps = ExtendableProps<
  RenderProps<ProgressBarRenderProps>,
  AriaProgressBarProps
>;
