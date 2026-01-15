import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Accordion, AccordionGroup } from './index';

describe('Accordion', () => {
  const baseProps = { 'data-testid': 'accordion' };

  const getAccordion = () => screen.getByTestId<HTMLButtonElement>('accordion');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Accordion {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const { container } = render(
      <Accordion className={className}>Body</Accordion>
    );

    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<Accordion {...baseProps} style={style} />);

    expect(getAccordion()).toHaveStyle({ padding: '20px' });
  });
});

describe('AccordionGroup', () => {
  const baseProps = { 'data-testid': 'accordion-group' };

  const getAccordionGroup = () =>
    screen.getByTestId<HTMLButtonElement>('accordion-group');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AccordionGroup {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const { container } = render(
      <AccordionGroup className={className}>Body</AccordionGroup>
    );

    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<AccordionGroup {...baseProps} style={style} />);

    expect(getAccordionGroup()).toHaveStyle({ padding: '20px' });
  });
});
