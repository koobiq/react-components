import type { UseButtonProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type ButtonRenderProps = {
  isHovered: boolean;
  isFocused: boolean;
  isPressed: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  isFocusVisible: boolean;
};

export type ButtonBaseProps = RenderProps<ButtonRenderProps> & {
  tabIndex?: number;
  slot?: string;
  /**
   * Whether this button is loading.
   */
  isLoading?: boolean;
  'aria-hidden'?: boolean | 'true' | 'false';
} & Omit<UseButtonProps<never>, 'elementType' | 'href'>;
