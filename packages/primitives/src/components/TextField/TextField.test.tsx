import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete, Menu, MenuItem } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../Input';
import { Textarea } from '../Textarea';

import { TextField } from './TextField';

describe('TextField primitive', () => {
  it('stops propagation for a handled Escape but keeps it for other keys', async () => {
    const parentSpy = vi.fn();

    render(
      <div
        aria-label="Parent"
        onKeyDown={parentSpy}
        role="button"
        tabIndex={-1}
      >
        <TextField aria-label="Search" defaultValue="text" isClearable>
          <Input />
        </TextField>
      </div>
    );

    const input = screen.getByRole('textbox', { name: 'Search' });

    await userEvent.click(input);
    await userEvent.keyboard('{ArrowLeft}');

    expect(parentSpy).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'ArrowLeft' })
    );

    await userEvent.keyboard('{Escape}');

    expect(input).toHaveValue('');
    expect(parentSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['Input', () => <Input />],
    ['Textarea', () => <Textarea />],
  ])(
    'should connect an %s to an Autocomplete without an element type prop',
    async (_, renderField) => {
      render(
        <Autocomplete>
          <TextField aria-label="Search">{renderField()}</TextField>
          <Menu>
            <MenuItem id="one">One</MenuItem>
            <MenuItem id="two">Two</MenuItem>
          </Menu>
        </Autocomplete>
      );

      const textbox = screen.getByRole('textbox', { name: 'Search' });

      await userEvent.click(textbox);
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() =>
        expect(textbox).toHaveAttribute('aria-activedescendant')
      );

      const activeDescendant = textbox.getAttribute('aria-activedescendant');

      expect(textbox).toHaveFocus();

      expect(
        activeDescendant ? document.getElementById(activeDescendant) : null
      ).toHaveTextContent('One');
    }
  );
});
