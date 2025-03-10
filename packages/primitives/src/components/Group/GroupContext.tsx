import { createContext, useContext } from 'react';

import type { GroupProps } from './index';

export const GroupContext = createContext<GroupProps>({});

export const useGroupContext = () => useContext(GroupContext);
