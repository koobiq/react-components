import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete, Menu, MenuItem } from 'react-aria-components';
import { describe, expect, it } from 'vitest';

import { Input } from '../Input';
import { Textarea } from '../Textarea';

import { TextField } from './TextField';

describe('TextField primitive', () => {
  it.each([
    ['Input', () => <Input aria-label="Search" />],
    ['Textarea', () => <Textarea aria-label="Search" />],
  ])(
    'should connect an %s to an Autocomplete without an element type prop',
    async (_, renderField) => {
      render(
        <Autocomplete>
          <TextField>{renderField()}</TextField>
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
