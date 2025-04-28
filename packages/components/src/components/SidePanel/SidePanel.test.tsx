import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

import { SidePanel } from './SidePanel';
import {
  sidePanelPropPosition,
  type SidePanelProps,
  sidePanelPropSize,
} from './types';

describe('SidePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps: SidePanelProps = {
    'data-testid': 'root',
    onOpenChange,
    slotProps: {
      dialog: {
        'data-testid': 'dialog',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getDialog = () => screen.getByTestId('dialog');

  function getBackdrop(): HTMLDivElement | null {
    return screen.queryByTestId('backdrop');
  }

  const getCloseButton = () => screen.getByTestId('close-button');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<SidePanel {...baseProps} ref={ref} open />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<SidePanel {...baseProps} className={className} open />);

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  describe('check the size prop', () => {
    it.each(sidePanelPropSize)('should apply the size as a "%s"', (size) => {
      render(<SidePanel {...baseProps} size={size} open />);

      expect(getRoot()).toHaveAttribute('data-size', size);
    });
  });

  describe('check the position prop', () => {
    it.each(sidePanelPropPosition)(
      'should apply the position as a "%s"',
      (position) => {
        render(<SidePanel {...baseProps} position={position} open />);

        expect(getRoot()).toHaveAttribute('data-position', position);
      }
    );
  });

  describe('check slots', () => {
    const dialogRef = createRef<HTMLDivElement>();
    const backdropRef = createRef<HTMLDivElement>();

    describe('dialog', () => {
      it('should merge a custom props with the default ones', () => {
        render(
          <SidePanel
            slotProps={{
              dialog: {
                'data-testid': 'dialog',
                className: 'foo',
                ref: dialogRef,
              },
            }}
            defaultOpen
          />
        );

        const dialog = getDialog();
        expect(dialog).toHaveClass('foo');
        expect(dialogRef.current).toBe(dialog);
      });
    });

    describe('backdrop', () => {
      it('should merge a custom props with the default ones', () => {
        render(
          <SidePanel
            slotProps={{
              backdrop: {
                'data-testid': 'backdrop',
                className: 'bar',
                ref: backdropRef,
              },
            }}
            defaultOpen
          />
        );

        const backdrop = getBackdrop();
        expect(backdrop).toHaveClass('bar');
        expect(backdropRef.current).toBe(backdrop);
      });
    });
  });

  describe('close button', () => {
    test('check the hideCloseButton prop', () => {
      const { rerender } = render(<SidePanel {...baseProps} open />);

      expect(getDialog()).toHaveAttribute('data-close-button', 'true');

      rerender(<SidePanel {...baseProps} hideCloseButton open />);

      expect(getDialog()).toHaveAttribute('data-close-button', 'false');
    });

    test('should call the onOpenChange handler when clicked', async () => {
      const onOpenChange = vi.fn();
      const onClick = vi.fn();

      render(
        <SidePanel
          {...baseProps}
          slotProps={{
            dialog: {
              slotProps: {
                'close-button': {
                  'data-testid': 'close-button',
                  onClick,
                },
              },
            },
          }}
          onOpenChange={onOpenChange}
          defaultOpen
        />
      );

      const closeButton = getCloseButton();

      await userEvent.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  it('should apply the focus trap', async () => {
    render(
      <>
        <button />
        <SidePanel defaultOpen>
          <input data-testid="input" />
        </SidePanel>
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
        <SidePanel defaultOpen hideCloseButton disableFocusManagement>
          <input data-testid="input" />
        </SidePanel>
      </>
    );

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(screen.getByTestId('button')).toHaveFocus();
  });

  it('should call the {onOpenChange} callback when the click outside is completed', async () => {
    const { rerender } = render(<SidePanel {...baseProps} open={false} />);

    await userEvent.click(document.body);

    rerender(
      <>
        <button data-testid="button" />
        <SidePanel {...baseProps} open />
      </>
    );

    await userEvent.click(screen.getByTestId('button'));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('should not call the {onOpenChange} callback when the click outside is completed and the {disableExitOnClickOutside} is set', async () => {
    render(
      <>
        <button data-testid="button" />
        <SidePanel {...baseProps} open disableExitOnClickOutside />
      </>
    );

    await userEvent.click(screen.getByTestId('button'));

    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  it('should call the {onOpenChange} callback when the {ESC} is pressed', async () => {
    const { rerender } = render(<SidePanel {...baseProps} open />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);

    rerender(<SidePanel {...baseProps} open={false} />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('should call the {onOpenChange} callback when the {ESC} is pressed and the {disableExitOnEscapeKeyDown} is set', async () => {
    render(<SidePanel {...baseProps} open disableExitOnEscapeKeyDown />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  it('should hide the backdrop when {hideBackdrop} is set', async () => {
    render(<SidePanel {...baseProps} defaultOpen hideBackdrop />);

    expect(getBackdrop()).not.toBeInTheDocument();
  });

  describe('control', () => {
    it('should open the component when the control is clicked', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <SidePanel
          {...baseProps}
          onOpenChange={onOpenChange}
          control={(props) => (
            <Button as="button" data-testid="control" {...props} />
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
        <SidePanel {...baseProps} defaultOpen>
          foo
        </SidePanel>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should display the content as the render function', () => {
      render(
        <SidePanel {...baseProps} defaultOpen>
          {() => <>foo</>}
        </SidePanel>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should close the component when the {close} is fired', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <SidePanel {...baseProps} onOpenChange={onOpenChange} defaultOpen>
          {({ close }) => <button onClick={close} data-testid="close" />}
        </SidePanel>
      );

      await userEvent.click(screen.getByTestId('close'));

      expect(onOpenChange).toHaveBeenCalledTimes(1);

      expect(onOpenChange.mock.results[0]?.value).toStrictEqual(false);
    });
  });
});
