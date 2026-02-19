'use client';

import { useState } from 'react';

import { clsx, useMultiRef } from '@koobiq/react-core';
import { Provider } from '@koobiq/react-primitives';

import { ActionsPanelContext } from '../../ActionsPanelContext';

import s from './ActionPanelContainer.module.css';
import { ActionsPanelContainerContext } from './ActionstPanelContainerContext';
import type { ActionsPanelContainerProps } from './types';

export const ActionsPanelContainer = (props: ActionsPanelContainerProps) => {
  const { children, className, ref, ...other } = props;

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const domRef = useMultiRef<HTMLElement>([ref, setPortalContainer]);

  return (
    <Provider
      values={[
        [
          ActionsPanelContainerContext,
          {
            portalContainer,
          },
        ],
        [
          ActionsPanelContext,
          {
            className: s.panel,
          },
        ],
      ]}
    >
      <div className={clsx(s.base, className)} ref={domRef} {...other}>
        {children}
      </div>
    </Provider>
  );
};
