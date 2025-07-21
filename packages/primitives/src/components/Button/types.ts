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
  /** Submitted as a pair with the button's value as part of the form data. */
  name?: string;
  /** The value associated with the button's name when it's submitted with the form data. */
  value?: string;
  /**
   * The `<form>` element to associate the button with.
   * The value of this attribute must be the id of a `<form>` in the same document.
   */
  form?: string;
  /**
   * The URL that processes the information submitted by the button.
   * Overrides the action attribute of the button's form owner.
   */
  formAction?: string;
  /** Indicates how to encode the form data that is submitted. */
  formEncType?: string;
  /** Indicates the HTTP method used to submit the form. */
  formMethod?: string;
  /** Indicates that the form is not to be validated when it is submitted. */
  formNoValidate?: boolean;
  /** Overrides the target attribute of the button's form owner. */
  formTarget?: string;
  tabIndex?: number;
  slot?: string;
  isLoading?: boolean;
} & Omit<UseButtonProps<never>, 'elementType' | 'href'>;
