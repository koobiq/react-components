import type {
  ModalTriggerPropContent,
  ModalTriggerPropControl,
  ModalTriggerProps,
} from '../ModalTrigger';

export const modalPropSize = ['small', 'medium', 'large'] as const;

export type ModalPropSize = (typeof modalPropSize)[number];

export type ModalPropControl = ModalTriggerPropControl;

export type ModalPropContent = ModalTriggerPropContent;

export type ModalProps = {
  /**
   * Component width size.
   * @default medium
   * */
  size?: ModalPropSize;
} & ModalTriggerProps;
