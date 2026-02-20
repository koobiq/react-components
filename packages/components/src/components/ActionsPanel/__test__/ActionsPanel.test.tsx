import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ActionsPanel } from '../ActionsPanel';
import { ActionsPanelContainer } from '../components';

describe('ActionsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = { 'data-testid': 'panel' };

  const getPanel = () => screen.getByTestId<HTMLDivElement>('panel');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ActionsPanelContainer>
        <ActionsPanel {...baseProps} ref={ref} selectedItemCount={1}>
          <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );

    expect(ref.current).toBe(getPanel());
  });

  it('should accept a custom className', () => {
    render(
      <ActionsPanelContainer>
        <ActionsPanel {...baseProps} className="foo" selectedItemCount={1}>
          <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );

    expect(getPanel()).toHaveClass('foo');
  });

  it('should accept a custom style', () => {
    render(
      <ActionsPanelContainer>
        <ActionsPanel
          {...baseProps}
          style={{ padding: 20 }}
          selectedItemCount={1}
        >
          <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );

    expect(getPanel()).toHaveStyle({ padding: '20px' });
  });
});
