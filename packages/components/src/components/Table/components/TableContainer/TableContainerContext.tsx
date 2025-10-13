'use client';

import { createContext, type Ref, useContext } from 'react';

export type TableContainerContextProps = {
  theadRef: Ref<HTMLElement>;
};

export const TableContainerContext = createContext<TableContainerContextProps>(
  {} as TableContainerContextProps
);

export const useTableContainerContext = () => useContext(TableContainerContext);
