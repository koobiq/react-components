import { createRef, useState } from 'react';

import { useHideOverflowItems } from '@koobiq/react-core';
import { render, screen, waitFor, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ActionsPanel } from '../ActionsPanel';
import { ActionsPanelContainer } from '../components';

vi.mock('../hooks', () => ({
  useInlinePaddingSize: () => 0,
}));

vi.mock('@koobiq/react-core', async (importActual) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importActual<typeof import('@koobiq/react-core')>();

  return {
    ...actual,
    useElementSize: vi.fn(() => ({ ref: () => {}, width: 0 })),
    useHideOverflowItems: vi.fn(),
  };
});

function mockOverflow(visibleMap: boolean[]) {
  (useHideOverflowItems as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
    {
      parentRef: () => {},
      visibleMap,
      itemsRefs: visibleMap.map(() => createRef<HTMLElement>()),
      parentSize: 1000,
    }
  );
}

describe('ActionsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOverflow([true, true, true]);
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

  describe('selectedExtraCount', () => {
    it('should render extra counter badge when selectedExtraCount is a number', () => {
      render(
        <ActionsPanelContainer>
          <ActionsPanel selectedItemCount={1} selectedExtraCount={3}>
            <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('should render +0 when selectedExtraCount is 0', () => {
      render(
        <ActionsPanelContainer>
          <ActionsPanel selectedItemCount={1} selectedExtraCount={0}>
            <ActionsPanel.Action key="action-1">Action 1</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByText('+0')).toBeInTheDocument();
    });
  });

  describe('overflow', () => {
    it('should mark hidden action with aria-hidden when it overflows', () => {
      mockOverflow([true, false, false, true]);

      render(
        <ActionsPanelContainer>
          <ActionsPanel
            selectedItemCount={1}
            slotProps={{
              counter: { 'data-testid': 'counter' },
            }}
          >
            <ActionsPanel.Action key="a1">Action 1</ActionsPanel.Action>
            <ActionsPanel.Action key="a2">Action 2</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByTestId('counter')).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });

    it('should set aria-hidden on counter when counter is hidden by overflow', () => {
      mockOverflow([true, false, true]);

      render(
        <ActionsPanelContainer>
          <ActionsPanel
            selectedItemCount={1}
            slotProps={{ counter: { 'data-testid': 'counter' } }}
          >
            <ActionsPanel.Action key="a1">Action 1</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByTestId('counter')).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });

    it('should set aria-hidden on more when more is hidden by overflow', () => {
      mockOverflow([true, true, false]);

      render(
        <ActionsPanelContainer>
          <ActionsPanel
            selectedItemCount={1}
            slotProps={{ more: { 'data-testid': 'more' } }}
          >
            <ActionsPanel.Action key="a1">Action 1</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByTestId('more')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should set data-only-counter-hidden when only counter is hidden', () => {
      mockOverflow([true, false, true]);

      render(
        <ActionsPanelContainer>
          <ActionsPanel
            selectedItemCount={1}
            slotProps={{ actions: { 'data-testid': 'actions' } }}
          >
            <ActionsPanel.Action key="a1">Action 1</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByTestId('actions')).toHaveAttribute(
        'data-only-counter-hidden',
        'true'
      );
    });

    it('should not set data-only-counter-hidden when an action is collapsed', () => {
      mockOverflow([true, false, false, true]);

      render(
        <ActionsPanelContainer>
          <ActionsPanel
            selectedItemCount={1}
            slotProps={{ actions: { 'data-testid': 'actions' } }}
          >
            <ActionsPanel.Action key="a1">Action 1</ActionsPanel.Action>
            <ActionsPanel.Action key="a2">Action 2</ActionsPanel.Action>
          </ActionsPanel>
        </ActionsPanelContainer>
      );

      expect(screen.getByTestId('actions')).not.toHaveAttribute(
        'data-only-counter-hidden'
      );
    });
  });
});
