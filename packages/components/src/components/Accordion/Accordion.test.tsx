import { createRef, useState } from 'react';

import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { Selection } from '../../index';

import { Accordion, AccordionGroup, type AccordionGroupProps } from './index';

describe('Accordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const accordionProps = { 'data-testid': 'accordion' };
  const summaryProps = { 'data-testid': 'summary' };
  const detailsProps = { 'data-testid': 'details' };

  const getAccordion = () => screen.getByTestId<HTMLButtonElement>('accordion');
  const getTrigger = () => screen.getByText('Summary');
  const getSummary = () => screen.getByTestId<HTMLButtonElement>('summary');
  const getDetails = () => screen.queryByTestId<HTMLButtonElement>('details');

  const user = userEvent.setup();

  it('should forward ref to root element', () => {
    const ref = createRef<HTMLDivElement>();

    const { container } = render(
      <Accordion {...accordionProps} ref={ref}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    expect(ref.current).toBe(container.firstChild);
  });

  it('should merge custom className with default ones', () => {
    const { container } = render(
      <Accordion className="foo">
        <Accordion.Summary>Summary</Accordion.Summary>
        <Accordion.Details>Details</Accordion.Details>
      </Accordion>
    );

    expect(container.firstChild).toHaveClass('foo');
  });

  it('should apply custom styles', () => {
    render(
      <Accordion {...accordionProps} style={{ padding: 20 }}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    expect(getAccordion()).toHaveStyle({
      padding: '20px',
    });
  });

  it('should be collapsed by default', () => {
    render(
      <Accordion {...accordionProps}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    expect(getDetails()).toHaveAttribute('aria-hidden', 'true');
  });

  it('should toggle expansion on summary click (uncontrolled)', async () => {
    render(
      <Accordion {...accordionProps}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    await user.click(getTrigger());
    expect(getDetails()).toHaveAttribute('aria-hidden', 'false');

    await user.click(getTrigger());
    expect(getDetails()).toHaveAttribute('aria-hidden', 'true');
  });

  it('should be expanded by default when defaultExpanded is true', () => {
    render(
      <Accordion {...accordionProps} defaultExpanded>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    expect(getDetails()).toHaveAttribute('aria-hidden', 'false');
  });

  it('should not unmount details when collapsed by default', async () => {
    render(
      <Accordion {...accordionProps}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    await user.click(getTrigger());
    await user.click(getTrigger());

    expect(getDetails()).toBeInTheDocument();
  });

  it('should unmount details when unmountOnExit is true', async () => {
    render(
      <Accordion {...accordionProps}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps} unmountOnExit>
          Details
        </Accordion.Details>
      </Accordion>
    );

    expect(getDetails()).not.toBeInTheDocument();

    await user.click(getTrigger());
    expect(getDetails()).toBeInTheDocument();

    await user.click(getTrigger());

    await waitFor(() => {
      expect(getDetails()).not.toBeInTheDocument();
    });
  });

  it('should work as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [expanded, setExpanded] = useState(false);

      return (
        <Accordion
          {...accordionProps}
          isExpanded={expanded}
          onExpandedChange={setExpanded}
        >
          <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
          <Accordion.Details {...detailsProps}>Details</Accordion.Details>
        </Accordion>
      );
    }

    render(<Controlled />);

    expect(getDetails()).toHaveAttribute('aria-hidden', 'true');

    await user.click(getTrigger());
    expect(getDetails()).toHaveAttribute('aria-hidden', 'false');
  });

  it('should call onExpandedChange when toggled', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    render(
      <Accordion {...accordionProps} onExpandedChange={onExpandedChange}>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    await user.click(getTrigger());

    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it('should not expand when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Accordion {...accordionProps} isDisabled>
        <Accordion.Summary {...summaryProps}>Summary</Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    await user.click(getTrigger());

    expect(getDetails()).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render summary as a custom heading element', () => {
    render(
      <Accordion {...accordionProps}>
        <Accordion.Summary {...summaryProps} as="h4">
          Summary
        </Accordion.Summary>
        <Accordion.Details {...detailsProps}>Details</Accordion.Details>
      </Accordion>
    );

    expect(getSummary().tagName.toLowerCase()).toBe('h4');
  });
});

describe('AccordionGroup', () => {
  const baseProps = { 'data-testid': 'accordion-group' };

  const user = userEvent.setup();

  const getAccordionGroup = () =>
    screen.getByTestId<HTMLDivElement>('accordion-group');

  const getDetails = (id: string) => screen.queryByTestId(`details-${id}`);

  const isExpanded = (id: string) =>
    expect(getDetails(id)).toHaveAttribute('aria-hidden', 'false');

  const isCollapsed = (id: string) =>
    expect(getDetails(id)).toHaveAttribute('aria-hidden', 'true');

  function RenderGroup(props?: AccordionGroupProps) {
    return (
      <AccordionGroup {...baseProps} style={{ inlineSize: 200 }} {...props}>
        <Accordion id="account">
          <Accordion.Summary>Account settings</Accordion.Summary>
          <Accordion.Details data-testid="details-account">
            Change your email, password, and security options.
          </Accordion.Details>
        </Accordion>

        <Accordion id="notifications">
          <Accordion.Summary>Notifications</Accordion.Summary>
          <Accordion.Details data-testid="details-notifications">
            Choose what you want to be notified about and how often.
          </Accordion.Details>
        </Accordion>

        <Accordion id="privacy">
          <Accordion.Summary>Privacy</Accordion.Summary>
          <Accordion.Details data-testid="details-privacy">
            Control profile visibility, data sharing, and connected apps.
          </Accordion.Details>
        </Accordion>
      </AccordionGroup>
    );
  }

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
    render(<AccordionGroup {...baseProps} style={{ padding: 20 }} />);
    expect(getAccordionGroup()).toHaveStyle({ padding: '20px' });
  });

  it('should render all accordions collapsed by default (single expansion mode)', () => {
    render(<RenderGroup />);

    isCollapsed('account');
    isCollapsed('notifications');
    isCollapsed('privacy');
  });

  it('should expand one accordion on click and collapse the previously expanded one by default', async () => {
    render(<RenderGroup />);

    await user.click(screen.getByText('Account settings'));
    isExpanded('account');
    isCollapsed('notifications');
    isCollapsed('privacy');

    await user.click(screen.getByText('Notifications'));
    isCollapsed('account');
    isExpanded('notifications');
    isCollapsed('privacy');
  });

  it('should expand items from defaultExpandedKeys', () => {
    render(<RenderGroup defaultExpandedKeys={['account']} />);

    isExpanded('account');
    isCollapsed('notifications');
    isCollapsed('privacy');
  });

  it('should allow multiple expanded items when allowsMultipleExpanded is true', async () => {
    render(<RenderGroup allowsMultipleExpanded />);

    await user.click(screen.getByText('Account settings'));
    await user.click(screen.getByText('Notifications'));

    isExpanded('account');
    isExpanded('notifications');
    isCollapsed('privacy');
  });

  it('should work as a controlled component (expandedKeys + onExpandedChange)', async () => {
    function Controlled() {
      const [expandedKeys, setExpandedKeys] = useState<Selection>(
        new Set(['account'])
      );

      return (
        <RenderGroup
          expandedKeys={expandedKeys}
          onExpandedChange={setExpandedKeys}
        />
      );
    }

    render(<Controlled />);

    isExpanded('account');
    isCollapsed('notifications');
    isCollapsed('privacy');

    await user.click(screen.getByText('Privacy'));
    isCollapsed('account');
    isCollapsed('notifications');
    isExpanded('privacy');
  });

  it('should call onExpandedChange when toggled (uncontrolled -> controlled callback)', async () => {
    const onExpandedChange = vi.fn();

    render(<RenderGroup onExpandedChange={onExpandedChange} />);

    await user.click(screen.getByText('Account settings'));

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('should not expand any accordion when group is disabled', async () => {
    render(<RenderGroup isDisabled />);

    await user.click(screen.getByText('Account settings'));
    await user.click(screen.getByText('Notifications'));

    isCollapsed('account');
    isCollapsed('notifications');
    isCollapsed('privacy');
  });
});
