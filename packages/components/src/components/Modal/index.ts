import { DialogHeader, DialogFooter, DialogContent } from '../Dialog';

export * from './Modal';
export * from './types';

/**
 * @deprecated
 * This component has been deprecated, please use `Modal.Header` instead.
 */
export const ModalHeader = DialogHeader;
/**
 * @deprecated
 * This component has been deprecated, please use `Modal.Body` instead.
 */
export const ModalContent = DialogContent;
/**
 * @deprecated
 * This component has been deprecated, please use `Modal.Footer` instead.
 */
export const ModalFooter = DialogFooter;
