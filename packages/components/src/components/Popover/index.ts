import { DialogHeader, DialogFooter, DialogContent } from '../Dialog';

export * from './Popover';
export * from './types';

/**
 * @deprecated
 * This component has been deprecated, please use `Popover.Header` instead.
 */
export const PopoverHeader = DialogHeader;
/**
 * @deprecated
 * This component has been deprecated, please use `Popover.Body` instead.
 */
export const PopoverContent = DialogContent;
/**
 * @deprecated
 * This component has been deprecated, please use `Popover.Footer` instead.
 */
export const PopoverFooter = DialogFooter;
