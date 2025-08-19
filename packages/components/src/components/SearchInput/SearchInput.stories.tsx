import { useState } from 'react';

import { useDebounceCallback } from '@koobiq/react-core';
import { IconMagnifyingGlass16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { fieldInputGroupPropVariant } from '../FieldComponents';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { SearchInput, type SearchInputProps } from './index';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new'],
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<SearchInputProps>;

export const Base: Story = {
  render: (args) => (
    <SearchInput
      label="Search"
      placeholder="Type a word..."
      onSubmit={(text) => alert(text)}
      {...args}
    />
  ),
};

export const Variant: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {fieldInputGroupPropVariant.map((variant) => (
          <SearchInput
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {fieldInputGroupPropVariant.map((variant) => (
          <SearchInput
            key={variant}
            variant={variant}
            aria-label="error"
            placeholder={`variant = ${variant}`}
            startAddon={<IconMagnifyingGlass16 />}
            errorMessage="This field is required"
            isInvalid
            {...args}
          />
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
      <SearchInput
        aria-label="fullWidth"
        placeholder="fullWidth"
        fullWidth
        {...args}
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {fieldInputGroupPropVariant.map((variant) => (
          <SearchInput
            key={variant}
            variant={variant}
            caption="disabled"
            aria-label="disabled"
            placeholder={`variant = ${variant}`}
            isDisabled
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Required: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <SearchInput
          label="Search"
          placeholder="Type a word..."
          caption="required"
          isRequired
          {...args}
        />
        <SearchInput
          label="Search"
          placeholder="Type a word..."
          caption="required, without an indicator"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          {...args}
        />
      </FlexBox>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args) {
    return (
      <SearchInput
        label="Search"
        placeholder="Type a word..."
        caption="read-only"
        defaultValue="best js tricks"
        isReadOnly
        {...args}
      />
    );
  },
};

export const Events: Story = {
  render: function Render(args) {
    const [currentText, setCurrentText] = useState('');
    const [submittedText, setSubmittedText] = useState('');

    return (
      <FlexBox gap="m" direction="column">
        <SearchInput
          label="Search"
          placeholder="Type a word..."
          onClear={() => setCurrentText('')}
          onChange={setCurrentText}
          onSubmit={setSubmittedText}
          value={currentText}
          {...args}
        />
        <Typography>Mirrored text: {currentText}</Typography>
        <Typography>Submitted text: {submittedText}</Typography>
      </FlexBox>
    );
  },
};

export const DebounceSearch: Story = {
  render: function Render(args) {
    const [debouncedValue, setDebouncedValue] = useState('');

    const [handleChangeDebounced] = useDebounceCallback({
      callback: setDebouncedValue,
    });

    return (
      <FlexBox gap="m" direction="column">
        <SearchInput
          label="Search"
          placeholder="Type a word..."
          onChange={handleChangeDebounced}
          {...args}
        />

        <Typography>Debounced result: {debouncedValue}</Typography>
      </FlexBox>
    );
  },
};
