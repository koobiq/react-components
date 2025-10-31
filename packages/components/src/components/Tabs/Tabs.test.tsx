import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, Tab, type TabsProps } from './index';

const TAB__TEST_ID = 'TAB';

const renderComponent = ({
  selectedKey,
  onSelectionChange,
  ...restProps
}: Omit<TabsProps<object>, 'children'>) => (
  <Tabs
    aria-label="tabs"
    onSelectionChange={onSelectionChange}
    selectedKey={selectedKey}
    {...restProps}
  >
    <Tab key={1}>tab-1</Tab>
    <Tab key={2} data-testid={TAB__TEST_ID}>
      tab-2
    </Tab>
    <Tab key={3}>tab-3</Tab>
    <Tab key={4}>tab-4</Tab>
  </Tabs>
);

describe('Tabs', () => {
  it('should set a dataTestId', () => {
    const dataTestId = 'data-test-id';

    const { getByTestId } = render(
      renderComponent({
        'data-testid': dataTestId,
      })
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('should set a className', () => {
    const className = 'foo';

    const { container } = render(
      renderComponent({
        className,
      })
    );

    expect(container.firstElementChild).toHaveClass(className);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        style,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle('padding: 20px');
  });

  it('should onChange get correct id', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        onSelectionChange,
        selectedKey: 1,
      })
    );

    await userEvent.click(screen.getByTestId(TAB__TEST_ID));

    expect(onSelectionChange).toBeCalledWith('2');
  });
});
