import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { Autocomplete, autocompletePropVariant } from './index.js';
import type { AutocompleteProps } from './index.js';

const meta = {
  title: 'E2E/Autocomplete',
  component: Autocomplete,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof Autocomplete>;

type State = { title: string } & Partial<AutocompleteProps>;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: Partial<AutocompleteProps>[] = [
  {},
  { defaultSelectedKey: 'ssh' },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {autocompletePropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <Autocomplete
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              placeholder="Placeholder"
              {...value}
              {...state}
            >
              <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
              <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
            </Autocomplete>
          ))
        )
      )}
    </E2eGrid>
  ),
};

// The list has no open prop, so it opens on focus: the spec clicks the input.
export const Open: Story = {
  render: () => (
    <Autocomplete
      aria-label="Protocol"
      menuTrigger="focus"
      defaultSelectedKey="ssh"
      disabledKeys={['telnet']}
      style={{ inlineSize: 200 }}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <Autocomplete.Section title="Secure">
        <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
        <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
      </Autocomplete.Section>
      <Autocomplete.Section title="Legacy">
        <Autocomplete.Item key="telnet">Telnet</Autocomplete.Item>
        <Autocomplete.Item key="ftp">FTP</Autocomplete.Item>
      </Autocomplete.Section>
    </Autocomplete>
  ),
};
