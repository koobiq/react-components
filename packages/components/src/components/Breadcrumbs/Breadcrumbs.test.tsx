import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BreadcrumbItem, type BreadcrumbItemProps, Breadcrumbs } from './index';

describe('Breadcrumbs', () => {
  const baseProps = { 'data-testid': 'breadcrumbs' };

  const getRoot = () => screen.getByTestId<HTMLElement>('breadcrumbs');

  it('should receive ref', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Breadcrumbs {...baseProps} ref={ref} />);
    const breadcrumbs = container.querySelector('nav');
    expect(ref.current).toBe(breadcrumbs);
  });

  it('should accept a custom class', () => {
    render(<Breadcrumbs {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(<Breadcrumbs style={style} />);

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  describe('BreadcrumbItem', () => {
    const baseProps = { 'data-testid': 'breadcrumb-item' };
    const getItem = () => screen.getByTestId<HTMLElement>('breadcrumb-item');

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

      const { container } = render(
        <BreadcrumbItem href="/" {...baseProps} ref={ref}>
          item
        </BreadcrumbItem>
      );

      const item = container.querySelector('a');

      expect(ref.current).toBe(item);
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
  });
});
