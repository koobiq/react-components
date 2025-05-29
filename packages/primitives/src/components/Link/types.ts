import type { ExtendableProps } from '@koobiq/react-core';

import type { UseLinkProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type LinkRenderProps = {
  isHovered: boolean;
  isFocused: boolean;
  isPressed: boolean;
  isDisabled: boolean;
  isFocusVisible: boolean;
};

export type LinkBaseProps = ExtendableProps<
  RenderProps<LinkRenderProps> & { tabIndex?: number },
  UseLinkProps
>;
