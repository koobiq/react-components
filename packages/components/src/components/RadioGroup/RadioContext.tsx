import { createContext, useContext } from 'react';

import type { RadioGroupPropSize } from './index';

export type RadioGroupContextProps = {
  size?: RadioGroupPropSize;
};

export const RadioGroupContext = createContext<RadioGroupContextProps>(
  {} as RadioGroupContextProps
);

export const useRadioGroupState = () => useContext(RadioGroupContext);
