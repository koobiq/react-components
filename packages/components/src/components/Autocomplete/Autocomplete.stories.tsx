import { useState } from 'react';

import { isString } from '@koobiq/react-core';
import {
  IconMagnifyingGlass16,
  IconNetworkDevice16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { useFilter } from '../../index';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import {
  Autocomplete,
  type AutocompleteProps,
  autocompletePropVariant,
} from './index.js';

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'Autocomplete.Item': Autocomplete.Item,
  },
  argTypes: {},
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<AutocompleteProps<any>>;

export const Base: Story = {
  render: (args) => (
    <Autocomplete label="Protocol" placeholder="Select protocol" {...args}>
      <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
      <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
      <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
      <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
      <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
    </Autocomplete>
  ),
};

export const DynamicItems: Story = {
  render: function Render() {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    return (
      <Autocomplete
        label="Protocol"
        defaultItems={items}
        placeholder="Select protocol"
      >
        {(item) => (
          <Autocomplete.Item key={item.key}>{item.name}</Autocomplete.Item>
        )}
      </Autocomplete>
    );
  },
};

export const Variant: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {autocompletePropVariant.map((variant) => (
          <Autocomplete
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          >
            <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
            <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
            <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
            <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
            <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
          </Autocomplete>
        ))}
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {autocompletePropVariant.map((variant) => (
          <Autocomplete
            key={variant}
            variant={variant}
            aria-label="error"
            placeholder={`variant = ${variant}`}
            errorMessage="This field is required"
            startAddon={<IconMagnifyingGlass16 />}
            isInvalid
            {...args}
          >
            <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
            <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
            <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
            <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
            <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
          </Autocomplete>
        ))}
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return (
      <Autocomplete
        label="Protocol"
        placeholder="Select protocol"
        fullWidth
        {...args}
      >
        <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
        <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
        <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
        <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
        <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
      </Autocomplete>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {autocompletePropVariant.map((variant) => (
          <Autocomplete
            key={variant}
            variant={variant}
            caption="disabled"
            aria-label="disabled"
            placeholder={`variant = ${variant}`}
            isDisabled
            {...args}
          >
            <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
            <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
            <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
            <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
            <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
          </Autocomplete>
        ))}
      </FlexBox>
    );
  },
};

export const DisabledItems: Story = {
  render: function Render() {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    return (
      <Autocomplete
        label="Protocol"
        defaultItems={items}
        placeholder="Select protocol"
        disabledKeys={['ssh', 'ipsec']}
      >
        {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
      </Autocomplete>
    );
  },
};

export const Required: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Autocomplete
          label="Protocol"
          caption="required"
          placeholder="Select protocol"
          isRequired
          {...args}
        >
          <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
          <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
          <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
          <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
          <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
        </Autocomplete>
        <Autocomplete
          label="Protocol"
          placeholder="Select protocol"
          caption="required, without an indicator"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          {...args}
        >
          <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
          <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
          <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
          <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
          <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
        </Autocomplete>
      </FlexBox>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args) {
    return (
      <Autocomplete
        label="Protocol"
        placeholder="Select protocol"
        isReadOnly
        {...args}
      >
        <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
        <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
        <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
        <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
        <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
      </Autocomplete>
    );
  },
};

export const Addons: Story = {
  render: function Render(args) {
    return (
      <Autocomplete
        label="Protocol"
        placeholder="Select protocol"
        startAddon={<IconNetworkDevice16 />}
        {...args}
      >
        <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
        <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
        <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
        <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
        <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
      </Autocomplete>
    );
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <Autocomplete
      label="Protocol"
      labelPlacement="side"
      placeholder="Select protocol"
      {...args}
    >
      <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
      <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
      <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
      <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
      <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
    </Autocomplete>
  ),
};

export const FullyControlled: Story = {
  render: function Render() {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    // Store Autocomplete input value, selected option, open state, and items
    // in a state tracker
    const [fieldState, setFieldState] = useState({
      selectedKey: '',
      inputValue: '',
      items,
    });

    // Implement custom filtering logic and control what items are
    // available to the Autocomplete.
    const { startsWith } = useFilter({ sensitivity: 'base' });

    // Specify how each of the Autocomplete values should change when an
    // option is selected from the list box
    const onSelectionChange: AutocompleteProps<object>['onSelectionChange'] = (
      key
    ) => {
      if (isString(key)) {
        setFieldState((prevState) => {
          const selectedItem = prevState.items.find(
            (option) => option.key === key
          );

          return {
            inputValue: selectedItem?.name || '',
            selectedKey: key,
            items: items.filter((item) =>
              startsWith(item.name, selectedItem?.name || '')
            ),
          };
        });
      }
    };

    // Specify how each of the Autocomplete values should change when the input
    // field is altered by the user
    const onInputChange: AutocompleteProps<object>['onInputChange'] = (
      value
    ) => {
      setFieldState((prevState) => ({
        inputValue: value,
        selectedKey: value === '' ? '' : prevState.selectedKey,
        items: items.filter((item) => startsWith(item.name, value)),
      }));
    };

    // Show entire list if user opens the menu manually
    const onOpenChange: AutocompleteProps<object>['onOpenChange'] = (
      isOpen,
      menuTrigger
    ) => {
      if (menuTrigger === 'manual' && isOpen) {
        setFieldState((prevState) => ({
          inputValue: prevState.inputValue,
          selectedKey: prevState.selectedKey,
          items,
        }));
      }
    };

    return (
      <Autocomplete
        label="Protocol"
        items={fieldState.items}
        onOpenChange={onOpenChange}
        placeholder="Select protocol"
        onInputChange={onInputChange}
        inputValue={fieldState.inputValue}
        selectedKey={fieldState.selectedKey}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <Autocomplete.Item key={item.key}>{item.name}</Autocomplete.Item>
        )}
      </Autocomplete>
    );
  },
};

export const MenuTriggerBehavior: Story = {
  render: (args) => (
    <Autocomplete
      label="Protocol"
      menuTrigger="focus"
      placeholder="Select protocol"
      {...args}
    >
      <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
      <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
      <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
      <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
      <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
    </Autocomplete>
  ),
};

export const CustomValue: Story = {
  render: (args) => (
    <Autocomplete
      label="Protocol"
      placeholder="Select protocol"
      allowsCustomValue
      disableShowChevron
      {...args}
    >
      <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
      <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
      <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
      <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
      <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
    </Autocomplete>
  ),
};

export const Events: Story = {
  render: function Render(args) {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    const [value, setValue] = useState('');

    const [selectedKey, setSelectedKey] = useState<string | number | null>(
      null
    );

    const onSelectionChange: AutocompleteProps<object>['onSelectionChange'] = (
      id
    ) => {
      setSelectedKey(id);
    };

    const onInputChange: AutocompleteProps<object>['onInputChange'] = (
      value
    ) => {
      setValue(value);
    };

    return (
      <FlexBox gap="m" direction="column">
        <Autocomplete
          label="Protocol"
          inputValue={value}
          defaultItems={items}
          selectedKey={selectedKey}
          placeholder="Select protocol"
          onInputChange={onInputChange}
          onSelectionChange={onSelectionChange}
          allowsCustomValue
          {...args}
        >
          {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
        </Autocomplete>
        <Typography>Current selected key: {selectedKey}</Typography>
        <Typography>Current input text: {value}</Typography>
      </FlexBox>
    );
  },
};

export const CustomFiltering: Story = {
  render: function Render(args) {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    const myFilter: AutocompleteProps<object>['defaultFilter'] = (
      textValue,
      inputValue
    ) => {
      if (inputValue.length === 0) {
        return true;
      }

      const textValueLowerCase = textValue.toLocaleLowerCase();
      const inputValueLowerCase = inputValue.toLocaleLowerCase();

      return (
        textValueLowerCase.slice(0, inputValue.length) === inputValueLowerCase
      );
    };

    return (
      <Autocomplete
        label="Protocol"
        defaultItems={items}
        defaultFilter={myFilter}
        placeholder="Select protocol"
        allowsCustomValue
        {...args}
      >
        {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
      </Autocomplete>
    );
  },
};
