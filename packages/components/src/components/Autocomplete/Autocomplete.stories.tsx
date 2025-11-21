import { type CSSProperties, useEffect, useState } from 'react';

import { isString, useBoolean, useDebounceCallback } from '@koobiq/react-core';
import {
  IconMagnifyingGlass16,
  IconNetworkDevice16,
  IconSlidersDot16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, useFilter } from '../../index';
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { ProgressSpinner } from '../ProgressSpinner';
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
    'Autocomplete.Section': Autocomplete.Section,
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<AutocompleteProps>;

export const Base: Story = {
  render: (args) => (
    <Autocomplete label="Protocol" placeholder="Search a protocol" {...args}>
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
        placeholder="Search a protocol"
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
        placeholder="Search a protocol"
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
        placeholder="Search a protocol"
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
          placeholder="Search a protocol"
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
          placeholder="Search a protocol"
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
        placeholder="Search a protocol"
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
        placeholder="Search a protocol"
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
      placeholder="Search a protocol"
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

export const Section: Story = {
  render: function Render() {
    const options = [
      {
        name: 'Group 1',
        children: [
          { id: 2, name: 'Item 1' },
          { id: 3, name: 'Item 2' },
          { id: 4, name: 'Item 3' },
        ],
      },
      {
        name: 'Group 2',
        children: [
          { id: 6, name: 'Item 4' },
          { id: 7, name: 'Item 5' },
          { id: 8, name: 'Item 6' },
        ],
      },
    ];

    return (
      <Autocomplete
        label="Options"
        defaultItems={options}
        style={{ inlineSize: 200 }}
        placeholder="Search…"
      >
        {(item) => (
          <Autocomplete.Section
            key={item.name}
            items={item.children}
            title={item.name}
          >
            {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
          </Autocomplete.Section>
        )}
      </Autocomplete>
    );
  },
};

export const ClearButton: Story = {
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
        items={items}
        label="Protocol"
        defaultSelectedKey="tls"
        style={{ inlineSize: 200 }}
        placeholder="Search a protocol"
        allowsCustomValue
        isClearable
      >
        {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
      </Autocomplete>
    );
  },
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
    const onSelectionChange: AutocompleteProps['onSelectionChange'] = (key) => {
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
    const onInputChange: AutocompleteProps['onInputChange'] = (value) => {
      setFieldState((prevState) => ({
        inputValue: value,
        selectedKey: value === '' ? '' : prevState.selectedKey,
        items: items.filter((item) => startsWith(item.name, value)),
      }));
    };

    // Show entire list if user opens the menu manually
    const onOpenChange: AutocompleteProps['onOpenChange'] = (
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
        placeholder="Search a protocol"
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
      placeholder="Search a protocol"
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
      placeholder="Search a protocol"
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
  render: function Render() {
    const items = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    const [value, setValue] = useState('');

    const [selectedKey, setSelectedKey] = useState<string | number | null>();

    const onSelectionChange: AutocompleteProps['onSelectionChange'] = (id) => {
      setSelectedKey(id);
    };

    const onInputChange: AutocompleteProps['onInputChange'] = (value) => {
      setValue(value);
    };

    return (
      <FlexBox gap="m" direction="column">
        <Autocomplete
          label="Protocol"
          defaultItems={items}
          placeholder="Search a protocol"
          onInputChange={onInputChange}
          onSelectionChange={onSelectionChange}
          allowsCustomValue
        >
          {(item) => (
            <Autocomplete.Item key={item.key}>{item.name}</Autocomplete.Item>
          )}
        </Autocomplete>
        <Typography>Current selected key: {selectedKey}</Typography>
        <Typography>Current input text: {value}</Typography>
      </FlexBox>
    );
  },
};

export const CustomFiltering: Story = {
  render: function Render() {
    const items: { key: string; name: string }[] = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    const myFilter: AutocompleteProps['defaultFilter'] = (
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
        placeholder="Search a protocol"
        allowsCustomValue
      >
        {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
      </Autocomplete>
    );
  },
};

export const Open: Story = {
  render: function Render() {
    const items: { key: string; name: string }[] = [
      { key: 'tls', name: 'TLS' },
      { key: 'ssh', name: 'SSH' },
      { key: 'pgp', name: 'PGP' },
      { key: 'ipsec', name: 'IPSec' },
      { key: 'kerberos', name: 'Kerberos' },
    ];

    const [isOpen, { toggle, set }] = useBoolean(false);

    return (
      <FlexBox gap="m">
        <Autocomplete
          isOpen={isOpen}
          onOpenChange={set}
          label="Protocol"
          defaultItems={items}
          placeholder="Search a protocol"
          style={{ inlineSize: 200 }}
          isLabelHidden
        >
          {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
        </Autocomplete>
        <Button onPress={toggle}>{isOpen ? 'Close' : 'Open'}</Button>
      </FlexBox>
    );
  },
};

export const NoItems: Story = {
  render: function Render() {
    return (
      <FlexBox gap="m" direction="column">
        <Autocomplete<{ name: string }>
          items={[]}
          aria-label="No items"
          placeholder="Search a protocol"
          caption="No options available"
          style={{ inlineSize: 200 }}
        >
          {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
        </Autocomplete>
        <Autocomplete<{ name: string }>
          items={[]}
          aria-label="No items"
          placeholder="Search a protocol"
          noItemsText="No results found"
          caption="No results found"
          style={{ inlineSize: 200 }}
        >
          {(item) => <Autocomplete.Item>{item.name}</Autocomplete.Item>}
        </Autocomplete>
      </FlexBox>
    );
  },
};

export const ServerSearch: Story = {
  render: function Render() {
    type Product = {
      id: number;
      title: string;
      price: number;
    };

    const [inputValue, setInputValue] = useState<string>('');
    const [items, setItems] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useBoolean(false);
    const [isLoading, setIsLoading] = useState(false);

    const [debounceSetIsLoading] = useDebounceCallback({
      callback: setIsLoading,
      delay: 300,
    });

    async function fetchProducts(query: string): Promise<Product[]> {
      if (!query.trim()) return [];

      const url = new URL('https://dummyjson.com/products/search');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', '10');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('DummyJSON error');

      const data = await res.json();

      return data.products ?? [];
    }

    useEffect(() => {
      if (inputValue && items.length) {
        setIsOpen.on();
      }
    }, [inputValue, items]);

    const onInputChange: AutocompleteProps['onInputChange'] = async (value) => {
      setInputValue(value);
      debounceSetIsLoading(true);

      try {
        const res = await fetchProducts(value);
        setItems(res);
      } catch {
        console.warn('Request failed!');
        setIsOpen.off();
      } finally {
        debounceSetIsLoading(false);
      }
    };

    return (
      <Autocomplete
        items={items}
        isOpen={isOpen}
        label="Products"
        menuTrigger="input"
        placeholder="Search…"
        style={{ inlineSize: 240 }}
        onOpenChange={setIsOpen.set}
        allowsEmptyCollection={false}
        onInputChange={onInputChange}
        startAddon={<IconMagnifyingGlass16 />}
        endAddon={
          <FlexBox gap="xs" alignItems="center" justifyContent="center">
            {isLoading && <ProgressSpinner />}
            <IconButton variant="theme-contrast">
              <IconSlidersDot16
                style={
                  {
                    '--icon-accent-color': 'var(--kbq-icon-theme)',
                  } as CSSProperties
                }
              />
            </IconButton>
          </FlexBox>
        }
        disableShowChevron
        allowsCustomValue
      >
        {(item) => (
          <Autocomplete.Item key={item.id}>{item.title}</Autocomplete.Item>
        )}
      </Autocomplete>
    );
  },
};
