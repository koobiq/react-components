import { createRef, useState } from 'react';

import { render, screen, waitFor, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ActionsPanel } from '../ActionsPanel';
import { ActionsPanelContainer } from '../components';

describe('ActionsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = { 'data-testid': 'panel' as const };

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

  describe('keyboard', () => {
    const user = userEvent.setup({ delay: null });

    function ControlledExample(props: {
      disableExitOnEscapeKeyDown?: boolean;
      onClearSelection?: () => void;
    }) {
      const [count, setCount] = useState(1);

      return (
        <ActionsPanelContainer>
          <ActionsPanel
            {...baseProps}
            selectedItemCount={count}
            disableExitOnEscapeKeyDown={props.disableExitOnEscapeKeyDown}
            onClearSelection={() => {
              setCount(0);
              props.onClearSelection?.();
            }}
          >
            <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
            <ActionsPanel.Action key="action-2">Action 2</ActionsPanel.Action>
            <ActionsPanel.Action key="action-3">Action 3</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );
    }

    it('should close the panel on Escape when focus is inside the panel', async () => {
      const onClearSelection = vi.fn();

      render(<ControlledExample onClearSelection={onClearSelection} />);

      const first = screen.getByRole('button', { name: 'Action 1' });

      await act(async () => {
        first.focus();
      });

      expect(first).toHaveFocus();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onClearSelection).toHaveBeenCalled();
      });
    });

    it('should not close the panel on Escape when disableExitOnEscapeKeyDown is true', async () => {
      const onClearSelection = vi.fn();

      render(
        <ControlledExample
          disableExitOnEscapeKeyDown
          onClearSelection={onClearSelection}
        />
      );

      const first = screen.getByRole('button', { name: 'Action 1' });

      await act(async () => {
        first.focus();
      });

      expect(first).toHaveFocus();

      await user.keyboard('{Escape}');

      expect(onClearSelection).not.toHaveBeenCalled();
      expect(screen.getByTestId('panel')).toBeInTheDocument();
    });

    it('should move focus with ArrowRight / ArrowLeft between actions', async () => {
      render(<ControlledExample />);

      const a1 = screen.getByRole('button', { name: 'Action 1' });
      const a2 = screen.getByRole('button', { name: 'Action 2' });
      const a3 = screen.getByRole('button', { name: 'Action 3' });

      await act(async () => {
        a1.focus();
      });

      expect(a1).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(a2).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(a3).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(a2).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(a1).toHaveFocus();
    });
  });
});
