import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import {
  ButtonToggle,
  ButtonToggleGroup,
  type ButtonToggleGroupProps,
} from './index';

const BUTTON_TOGGLE__TEST_ID = 'BUTTON_TOGGLE';

const renderComponent = ({
  selectedKey,
  onSelectionChange,
  ...restProps
}: Omit<ButtonToggleGroupProps, 'children'>) => (
  <ButtonToggleGroup
    onSelectionChange={onSelectionChange}
    selectedKey={selectedKey}
    {...restProps}
  >
    <ButtonToggle id={1}>Label 1</ButtonToggle>
    <ButtonToggle data-testid={BUTTON_TOGGLE__TEST_ID} id={2}>
      Label 2
    </ButtonToggle>
    <ButtonToggle id={3}>Label 3</ButtonToggle>
    <ButtonToggle id={4}>Label 4</ButtonToggle>
  </ButtonToggleGroup>
);

describe('ButtonToggleGroup', () => {
  it('should onChange get correct id', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        onSelectionChange,
        selectedKey: 1,
      })
    );

    await userEvent.click(screen.getByTestId(BUTTON_TOGGLE__TEST_ID));

    expect(onSelectionChange).toBeCalledWith(2);
  });

  it('should set a dataTestId', () => {
    const dataTestId = 'data-test-id';

    const { getByTestId } = render(
      renderComponent({
        selectedKey: 2,
        onSelectionChange: () => null,
        'data-testid': dataTestId,
      })
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('should set a className', () => {
    const className = 'foo';

    const { container } = render(
      renderComponent({
        onSelectionChange: () => null,
        className,
        selectedKey: 2,
      })
    );

    expect(container.firstElementChild).toHaveClass(className);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        onSelectionChange: () => null,
        style,
        selectedKey: 2,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });
});
