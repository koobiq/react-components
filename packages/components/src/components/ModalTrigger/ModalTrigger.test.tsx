import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Link } from '../Link';

import { ModalTrigger } from './ModalTrigger';
import type { ModalTriggerProps } from './types';

describe('ModalTrigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  function getBackdrop(): HTMLDivElement | null {
    return screen.queryByTestId('backdrop');
  }

  const baseProps: ModalTriggerProps = {
    'data-testid': 'modal',
    onOpenChange,
    slotProps: {
      backdrop: {
        'data-testid': 'backdrop',
      },
    },
  };

  it('should apply the focus trap', async () => {
    render(
      <>
        <button />
        <ModalTrigger defaultOpen>
          <input data-testid="input" />
        </ModalTrigger>
      </>
    );

    await userEvent.tab();
    await userEvent.tab();

    expect(screen.getByTestId('input')).toHaveFocus();
  });

  it('should not apply the focus trap when {disableFocusManagement} is set', async () => {
    render(
      <>
        <button data-testid="button" />
        <ModalTrigger defaultOpen hideCloseButton disableFocusManagement>
          <input data-testid="input" />
        </ModalTrigger>
      </>
    );

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(screen.getByTestId('button')).toHaveFocus();
  });

  it('should call the {onOpenChange} callback when the click outside is completed', async () => {
    const { rerender } = render(<ModalTrigger {...baseProps} open={false} />);

    await userEvent.click(document.body);

    rerender(
      <>
        <button data-testid="button" />
        <ModalTrigger {...baseProps} open />
      </>
    );

    await userEvent.click(screen.getByTestId('button'));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('should not call the {onOpenChange} callback when the click outside is completed and the {disableExitOnClickOutside} is set', async () => {
    render(
      <>
        <button data-testid="button" />
        <ModalTrigger {...baseProps} open disableExitOnClickOutside />
      </>
    );

    await userEvent.click(screen.getByTestId('button'));

    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  it('should call the {onOpenChange} callback when the {ESC} is pressed', async () => {
    const { rerender } = render(<ModalTrigger {...baseProps} open />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);

    rerender(<ModalTrigger {...baseProps} open={false} />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('should call the {onOpenChange} callback when the {ESC} is pressed and the {disableExitOnEscapeKeyDown} is set', async () => {
    render(<ModalTrigger {...baseProps} open disableExitOnEscapeKeyDown />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  it('should hide the backdrop when {hideBackdrop} is set', async () => {
    render(<ModalTrigger {...baseProps} defaultOpen hideBackdrop />);

    expect(getBackdrop()).not.toBeInTheDocument();
  });

  describe('control', () => {
    it('should open the component when the control is clicked', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <ModalTrigger
          {...baseProps}
          onOpenChange={onOpenChange}
          control={(props) => (
            <Link as="button" data-testid="control" {...props} />
          )}
        />
      );

      await userEvent.click(screen.getByTestId('control'));

      expect(onOpenChange).toHaveBeenCalledTimes(1);

      expect(onOpenChange.mock.results[0]?.value).toStrictEqual(true);
    });
  });

  describe('content', () => {
    it('should display the content as the string', () => {
      render(
        <ModalTrigger {...baseProps} defaultOpen>
          foo
        </ModalTrigger>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should display the content as the render function', () => {
      render(
        <ModalTrigger {...baseProps} defaultOpen>
          {() => <>foo</>}
        </ModalTrigger>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should close the component when the {close} is fired', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <ModalTrigger {...baseProps} onOpenChange={onOpenChange} defaultOpen>
          {({ close }) => <button onClick={close} data-testid="close" />}
        </ModalTrigger>
      );

      await userEvent.click(screen.getByTestId('close'));

      expect(onOpenChange).toHaveBeenCalledTimes(1);

      expect(onOpenChange.mock.results[0]?.value).toStrictEqual(false);
    });
  });
});
