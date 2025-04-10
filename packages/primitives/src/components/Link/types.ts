import type { ExtendableProps } from '@koobiq/react-core';

import type { UseLinkProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type LinkRenderProps = {
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
  disabled: boolean;
  focusVisible: boolean;
};

export type LinkBaseProps = ExtendableProps<
  RenderProps<LinkRenderProps> & { tabIndex?: number },
  UseLinkProps
>;
