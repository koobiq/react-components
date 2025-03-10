import type {
  ModalTriggerProps,
  ModalTriggerPropControl,
  ModalTriggerPropContent,
} from '../ModalTrigger';

export const sidePanelPropSize = ['small', 'medium', 'large'] as const;

export type SidePanelPropSize = (typeof sidePanelPropSize)[number];

export const sidePanelPropPosition = ['left', 'right'] as const;

export type SidePanelPropPosition = (typeof sidePanelPropPosition)[number];

export type SidePanelPropControl = ModalTriggerPropControl;

export type SidePanelPropContent = ModalTriggerPropContent;

export type SidePanelProps = {
  /**
   * Component width size.
   * @default medium
   * */
  size?: SidePanelPropSize;
  /**
   * Side from which the side panel will appear.
   * @default left
   * */
  position?: SidePanelPropPosition;
} & ModalTriggerProps;
