import { createRef, useState } from 'react';

import { screen, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Autocomplete } from '../../Autocomplete';
import {
  ContentPanel,
  ContentPanelContainer,
  type ContentPanelContainerProps,
} from '../index';

const renderComponent = (
  props: Omit<ContentPanelContainerProps, 'children'>
) => (
  <ContentPanelContainer {...props}>
    <ContentPanel>content</ContentPanel>
  </ContentPanelContainer>
);

describe('ContentPanelContainer', () => {
  const baseProps = { 'data-testid': 'container' };

  const getContainer = () => screen.getByTestId<HTMLDivElement>('container');

  const user = userEvent.setup();

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    const { container } = render(
      <ContentPanelContainer {...baseProps} ref={ref} />
    );

    const component = container.querySelector('div');
    expect(ref.current).toBe(component);
  });

  it('should accept a custom class', () => {
    render(
      <ContentPanelContainer {...baseProps} className="foo" defaultOpen />
    );

    expect(getContainer()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<ContentPanelContainer {...baseProps} style={style} defaultOpen />);
    expect(getContainer()).toHaveStyle({ padding: '20px' });
  });

  describe('slotProps.body', () => {
    const getBody = () => screen.getByTestId<HTMLDivElement>('body');

    it('should accept a custom class', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', className: 'body-foo' },
          }}
        />
      );

      expect(getBody()).toHaveClass('body-foo');
    });

    it('should set a custom style', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', style: { padding: 20 } },
          }}
        />
      );

      expect(getBody()).toHaveStyle({ padding: '20px' });
    });

    it('should accept the ref', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', ref },
          }}
        />
      );

      expect(ref.current).toBe(getBody());
    });

    it('should pass through custom attributes', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: {
              'data-testid': 'body',
              'data-foo': 'bar',
              tabIndex: 0,
            },
          }}
        />
      );

      expect(getBody()).toHaveAttribute('data-foo', 'bar');
      expect(getBody()).toHaveAttribute('tabindex', '0');
    });
  });

  it('should close the panel on Escape key press', async () => {
    const onOpenChange = vi.fn();

    render(renderComponent({ defaultOpen: true, onOpenChange }));
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it('should not close the panel on Escape when disableExitOnEscapeKeyDown is true', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      renderComponent({
        defaultOpen: true,
        onOpenChange,
        disableExitOnEscapeKeyDown: true,
      })
    );

    await user.keyboard('{Escape}');

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('should close the panel on Escape inside a body', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ContentPanelContainer
        {...baseProps}
        onOpenChange={onOpenChange}
        defaultOpen
      >
        <button data-testid="button" />
        <ContentPanel>content</ContentPanel>
      </ContentPanelContainer>
    );

    const button = screen.getByTestId<HTMLButtonElement>('button');

    button.focus();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it('should close the panel on Escape with nested overlays', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ContentPanelContainer
        {...baseProps}
        onOpenChange={onOpenChange}
        defaultOpen
      >
        <ContentPanel>
          <Autocomplete label="autocomplete">
            <Autocomplete.Item key="1">One</Autocomplete.Item>
            <Autocomplete.Item key="2">Two</Autocomplete.Item>
          </Autocomplete>
        </ContentPanel>
      </ContentPanelContainer>
    );

    const input = screen.queryByRole('combobox');

    if (input) await user.click(input);
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it('should close the panel via toggle', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ContentPanelContainer defaultOpen onOpenChange={onOpenChange}>
        {({ toggle, isOpen }) => (
          <>
            <button onClick={toggle}>{isOpen ? 'close' : 'open'}</button>

            <ContentPanel>content</ContentPanel>
          </>
        )}
      </ContentPanelContainer>
    );

    await user.click(screen.getByRole('button', { name: 'close' }));

    expect(screen.getByRole('button', { name: 'open' })).toBeInTheDocument();

    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  describe('ContentPanelContainer (controlled open)', () => {
    it('should open and close the panel in controlled mode', async () => {
      function ControlledExample(props: {
        onOpenChange?: (open: boolean) => void;
      }) {
        const [open, setOpen] = useState(false);

        return (
          <ContentPanelContainer
            isOpen={open}
            onOpenChange={(next) => {
              setOpen(next);
              props.onOpenChange?.(next);
            }}
          >
            {({ toggle, isOpen }) => (
              <>
                <button onClick={toggle}>{isOpen ? 'close' : 'open'}</button>
                <ContentPanel>content</ContentPanel>
              </>
            )}
          </ContentPanelContainer>
        );
      }

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(<ControlledExample onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'open' }));
      expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

      expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'close' }));
      expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);

      expect(screen.getByRole('button', { name: 'open' })).toBeInTheDocument();
    });
  });
});
