import { type CSSProperties } from 'react';

import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { hasFlag } from 'country-flag-icons';
import * as flags1x1 from 'country-flag-icons/react/1x1';
import * as flags3x2 from 'country-flag-icons/react/3x2';

import { FlexBox } from '../FlexBox';
import { SelectNext as Select } from '../SelectNext';
import { Typography } from '../Typography';

import s from './Flag.stories.module.css';
import {
  Flag,
  type FlagProps,
  flagPropShape,
  flagPropShadow,
} from './index.js';

const meta = {
  title: 'Components/Flag',
  component: Flag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    shape: {
      options: flagPropShape,
      control: { type: 'inline-radio' },
    },
    shadow: {
      options: flagPropShadow,
      control: { type: 'inline-radio' },
    },
  },
  tags: ['status:new', 'date:2026-07-10'],
} satisfies Meta<typeof Flag>;

export default meta;
type Story = StoryObj<FlagProps>;

export const Base: Story = {
  render: (args) => (
    <Flag {...args}>
      <flags3x2.DE />
    </Flag>
  ),
};

export const Shape: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {flagPropShape.map((shape) => (
        <FlexBox key={shape} gap="xs" direction="column" alignItems="center">
          <Flag
            {...args}
            shape={shape}
            style={{ fontSize: 32 } as CSSProperties}
          >
            <flags1x1.DE />
          </Flag>
          <Typography variant="text-compact">{shape}</Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Shadow: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {flagPropShadow.map((shadow) => (
        <FlexBox key={shadow} gap="xs" direction="column" alignItems="center">
          <Flag
            {...args}
            shadow={shadow}
            style={{ fontSize: 32 } as CSSProperties}
          >
            <flags3x2.JP />
          </Flag>
          <Typography variant="text-compact">shadow = {shadow}</Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Flag
      {...args}
      empty
      label="Unknown"
      style={{ fontSize: 32 } as CSSProperties}
    />
  ),
};

/**
 * The library ships no flag data, so guard the code with `hasFlag` and render a
 * neutral placeholder (or your own glyph) when a flag is missing.
 */
export const Fallback: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {['DE', 'ZZ'].map((code) => {
        const known = hasFlag(code);
        const FlagIcon = flags3x2[code as keyof typeof flags3x2];

        return (
          <FlexBox key={code} gap="xs" direction="column" alignItems="center">
            <Flag
              {...args}
              empty={!known}
              label={known ? code : 'Unknown country'}
              style={{ fontSize: 32 } as CSSProperties}
            >
              {known ? <FlagIcon /> : null}
            </Flag>
            <Typography variant="text-compact">{code}</Typography>
          </FlexBox>
        );
      })}
    </FlexBox>
  ),
};

/**
 * When the flag carries meaning and has no adjacent text, pass a `label`
 * (`role="img"`). When adjacent text already names the country, mark the flag
 * `decorative` so it is hidden from assistive tech.
 */
export const Accessibility: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="row" alignItems="center">
      <Flag {...args} label="Germany" style={{ fontSize: 18 } as CSSProperties}>
        <flags3x2.DE />
      </Flag>
      <Typography>
        <Flag {...args} decorative style={{ fontSize: 18 } as CSSProperties}>
          <flags3x2.DE />
        </Flag>{' '}
        Germany
      </Typography>
    </FlexBox>
  ),
};

/**
 * The flag follows text size — control it with `font-size` / `width` / `height`.
 */
export const Sizes: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {[16, 24, 32, 48].map((size) => (
        <Flag
          key={size}
          {...args}
          label="Germany"
          style={{ fontSize: size } as CSSProperties}
        >
          <flags3x2.DE />
        </Flag>
      ))}
    </FlexBox>
  ),
};

/**
 * Non-country / other ratios are supported without a prop by overriding
 * `--kbq-flag-aspect-ratio`.
 */
export const AspectRatio: Story = {
  render: (args) => (
    <Flag
      {...args}
      label="Nepal"
      style={
        { fontSize: 48, '--kbq-flag-aspect-ratio': '4 / 3' } as CSSProperties
      }
    >
      <flags3x2.NP />
    </Flag>
  ),
};

/**
 * A stylized, volumetric look is consumer CSS — rounded corners via
 * `--kbq-flag-border-radius`, plus a drop shadow and a "folds" gradient overlay.
 */
export const Custom: Story = {
  render: (args) => (
    <Flag
      {...args}
      shadow="none"
      label="Brazil"
      className={s.stylized}
      style={
        {
          fontSize: 64,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          '--kbq-flag-border-radius': 'var(--kbq-size-xs)',
        } as CSSProperties
      }
    >
      <flags3x2.BR />
    </Flag>
  ),
};

// Languages are picked with a neutral globe icon, not a flag:
// one language spans several countries.
const languages = [
  'English (UK)',
  'English (US)',
  'Español',
  'Français',
  'Русский',
  'हिन्दी',
  '中文',
];

/**
 * A flag represents a country, not a language. Use a globe icon (not a flag) for
 * language selection.
 */
export const NotForLanguage: Story = {
  render: () => (
    <Select
      label="Language"
      placeholder="Select your language"
      startAddon={<IconGlobe16 />}
      style={{ inlineSize: 320 }}
      defaultValue={languages[0]}
    >
      {languages.map((language) => (
        <Select.Item key={language} id={language}>
          {language}
        </Select.Item>
      ))}
    </Select>
  ),
};

const countries = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'US', name: 'United States' },
  { code: 'BR', name: 'Brazil' },
];

const CountryOption = ({ code, name }: { code: string; name: string }) => {
  const FlagIcon = flags3x2[code as keyof typeof flags3x2];

  return (
    <FlexBox gap="xs" alignItems="center">
      <Flag decorative>
        <FlagIcon />
      </Flag>
      {name}
    </FlexBox>
  );
};

export const FlagsInSelect: Story = {
  render: () => (
    <Select
      label="Country"
      placeholder="Select a country"
      defaultValue={countries[0].code}
      style={{ inlineSize: 240 }}
      renderValue={(state) => {
        const item = state.selectedItems?.[0];

        if (!item) return null;

        return (
          <CountryOption
            code={String(item.key)}
            name={String(item.textValue)}
          />
        );
      }}
    >
      {countries.map(({ code, name }) => (
        <Select.Item key={code} id={code} textValue={name}>
          <CountryOption code={code} name={name} />
        </Select.Item>
      ))}
    </Select>
  ),
};
