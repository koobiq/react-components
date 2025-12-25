import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Provider } from '../../Provider';
import { BreadcrumbsContext } from '../BreadcrumbsContext';
import { BreadcrumbItem, type BreadcrumbItemProps } from '../components';

describe('BreadcrumbItem', () => {
  const baseProps = { 'data-testid': 'breadcrumb' };
  const getItem = () => screen.getByTestId<HTMLElement>('breadcrumb');

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should receive ref', () => {
    const ref = createRef<HTMLSpanElement>();

    const { container } = render(
      <BreadcrumbItem {...baseProps} ref={ref}>
        item
      </BreadcrumbItem>
    );

    const item = container.querySelector('span');

    expect(ref.current).toBe(item);
  });

  it('should render as an anchor when href is provided', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <BreadcrumbItem href="/" {...baseProps} ref={ref}>
        Text
      </BreadcrumbItem>
    );

    const el = screen.getByText('Text');
    expect(el.tagName.toLowerCase()).toBe('a');
  });

  it('should render a span by default when href is not provided', () => {
    render(<BreadcrumbItem>Text</BreadcrumbItem>);

    const el = screen.getByText('Text');
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('should accept a custom class', () => {
    render(
      <BreadcrumbItem {...baseProps} className="foo">
        item
      </BreadcrumbItem>
    );

    expect(getItem()).toHaveClass('foo');
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      <BreadcrumbItem {...baseProps} style={style}>
        item
      </BreadcrumbItem>
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should mark the item as current when isCurrent is true', () => {
    render(<BreadcrumbItem isCurrent>Current</BreadcrumbItem>);

    expect(screen.getByText('Current')).toHaveAttribute('data-current', 'true');
  });

  it('should remain non-interactive when disabled', async () => {
    render(<BreadcrumbItem isDisabled>Disabled</BreadcrumbItem>);
    const el = screen.getByText('Disabled');

    expect(el).toHaveAttribute('data-disabled', 'true');

    await user.hover(el);
    expect(el).not.toHaveAttribute('data-hovered', 'true');

    await user.pointer([{ target: el, keys: '[MouseLeft>]' }]);
    expect(el).not.toHaveAttribute('data-pressed', 'true');

    await user.tab();
    expect(el).not.toHaveAttribute('data-focus-visible', 'true');
  });

  it('should update its hover state on hover and unhover', async () => {
    render(<BreadcrumbItem>Hover me</BreadcrumbItem>);
    const el = screen.getByText('Hover me');

    await user.hover(el);
    expect(el).toHaveAttribute('data-hovered', 'true');

    await user.unhover(el);
    expect(el).not.toHaveAttribute('data-hovered', 'true');
  });

  it('should update its pressed state on pointer down', async () => {
    render(<BreadcrumbItem>Press me</BreadcrumbItem>);
    const el = screen.getByText('Press me');

    await user.pointer([{ target: el, keys: '[MouseLeft>]' }]);
    expect(el).toHaveAttribute('data-pressed', 'true');
  });

  it('should read size from BreadcrumbsContext', () => {
    render(
      <BreadcrumbsContext.Provider value={{ size: 'big' }}>
        <BreadcrumbItem>Item</BreadcrumbItem>
      </BreadcrumbsContext.Provider>
    );

    expect(screen.getByText('Item')).toHaveAttribute('data-size', 'big');
  });

  describe('addons', () => {
    it('should render the start addon', () => {
      const label = 'crumb';
      const addonStartText = 'addon-left';
      const AddonStart = () => <span>{addonStartText}</span>;

      const props: BreadcrumbItemProps = {
        ...baseProps,
        children: label,
        startAddon: <AddonStart />,
      };

      render(<BreadcrumbItem {...props} />);

      expect(getItem()).toHaveTextContent(addonStartText + label);
    });

    it('should render the end addon', () => {
      const label = 'crumb';
      const addonEndText = 'addon-right';
      const AddonEnd = () => <span>{addonEndText}</span>;

      const props: BreadcrumbItemProps = {
        ...baseProps,
        children: label,
        endAddon: <AddonEnd />,
      };

      render(<BreadcrumbItem {...props} />);

      expect(getItem()).toHaveTextContent(label + addonEndText);
    });

    it('should render the start and end addons', () => {
      const label = 'crumb';
      const addonStartText = 'addon-left';
      const addonEndText = 'addon-right';
      const AddonStart = () => <span>{addonStartText}</span>;

      const AddonEnd = () => <span>{addonEndText}</span>;

      const props: BreadcrumbItemProps = {
        ...baseProps,
        children: label,
        startAddon: <AddonStart />,
        endAddon: <AddonEnd />,
      };

      render(<BreadcrumbItem {...props} />);

      expect(getItem()).toHaveTextContent(
        addonStartText + label + addonEndText
      );
    });
  });

  it('check a client side routing', async () => {
    const onNavigate = vi.fn();

    render(
      <Provider
        router={{
          navigate: () => {
            onNavigate();
          },
        }}
      >
        <BreadcrumbItem href="/" {...baseProps}>
          Item
        </BreadcrumbItem>
      </Provider>
    );

    await userEvent.click(screen.getByText('Item'));

    expect(onNavigate).toBeCalled();
  });
});
