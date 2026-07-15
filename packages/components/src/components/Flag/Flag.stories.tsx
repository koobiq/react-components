import { type CSSProperties } from 'react';

import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { hasFlag } from 'country-flag-icons';
import { DE as DE1x1 } from 'country-flag-icons/react/1x1';
import { BR, DE, FR, JP, US } from 'country-flag-icons/react/3x2';

import { FlexBox } from '../FlexBox';
import { SelectNext as Select } from '../SelectNext';
import { Typography } from '../Typography';

import s from './Flag.stories.module.css';
import {
  Flag,
  type FlagProps,
  flagPropShape,
  flagPropAspectRatio,
} from './index.js';

// These small maps let examples look up a flag by ISO code.
const flags3x2 = { BR, DE, FR, JP, US };
const flags1x1 = { DE: DE1x1 };

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
    aspectRatio: {
      options: flagPropAspectRatio,
      control: { type: 'select' },
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
          <Flag {...args} shape={shape} size={32}>
            <flags1x1.DE />
          </Flag>
          <Typography variant="text-compact">{shape}</Typography>
        </FlexBox>
      ))}
      <FlexBox gap="xs" direction="column" alignItems="center">
        <Flag {...args} size={32} aspectRatio="1 / 1">
          <flags1x1.DE />
        </Flag>
        <Typography variant="text-compact">square</Typography>
      </FlexBox>
    </FlexBox>
  ),
};

export const Shadow: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {[false, true].map((hideShadow) => (
        <FlexBox
          key={String(hideShadow)}
          gap="xs"
          direction="column"
          alignItems="center"
        >
          <Flag {...args} hideShadow={hideShadow} size={32}>
            <flags3x2.JP />
          </Flag>
          <Typography variant="text-compact">
            hideShadow = {String(hideShadow)}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Flag {...args} role="img" aria-label="Unknown" size={32} />
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
              role="img"
              aria-label={known ? code : 'Unknown country'}
              size={32}
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
 * Flag adds no ARIA semantics on its own — supply them with standard attributes:
 * `role="img"` + `aria-label` for a meaningful flag with no adjacent text,
 * `aria-labelledby` when visible text names it, or `aria-hidden` when it is
 * purely decorative.
 */
export const Accessibility: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="row">
      {/* Meaningful flag, no adjacent text. */}
      <Flag {...args} role="img" aria-label="Germany" size={18}>
        <flags3x2.DE />
      </Flag>

      {/* Decorative flag beside visible text. */}
      <FlexBox gap="xs" alignItems="center">
        <Flag {...args} role="img" aria-hidden="true" size={18}>
          <flags3x2.DE />
        </Flag>
        <Typography>Germany</Typography>
      </FlexBox>
    </FlexBox>
  ),
};

/**
 * Set an explicit height with the `size` prop (a number is pixels, a string is
 * any CSS length). Omit it and the flag defaults to `1em`, tracking the text.
 */
export const Sizes: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {[16, 24, 32, 48].map((size) => (
        <Flag key={size} {...args} role="img" aria-label="Germany" size={size}>
          <flags3x2.DE />
        </Flag>
      ))}
    </FlexBox>
  ),
};

/**
 * Set the box ratio with the `aspectRatio` prop — common presets plus any CSS
 * value. The graphic is cropped to fill (`object-fit: cover`).
 */
export const AspectRatio: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      <FlexBox gap="xs" direction="column" alignItems="center">
        <Flag
          {...args}
          role="img"
          aria-label="Antarctica"
          size={48}
          aspectRatio="4 / 3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="flag-icons-aq"
            viewBox="0 0 640 480"
          >
            <path fill="#3a7dce" d="M0 0h640v480H0z" />
            <path
              fill="#fff"
              d="M157.7 230.8c-3.5-7.8-3.5-7.8-3.5-15.6-1.8 0-2 .3-3 0-1.1-.3-1.5 7.2-4.8 5.8-.5-.8 2.4-6.2-.7-8.5-1-.7.2-5.2-.2-7.2 0 0-4 2.4-7-5.8-1.5-2.2-3.5 2-3.5 2s.9 2.4-.7 3c-2.2-1.8-3.9-.8-6.7-3.4s.6-5.4-4.8-7.5c3.5-9.8 3.5-7.9 12.2-11.8-5.2-4-5.2-4-8.7-9.8-5.2-2-7-4-12.2-7.8-7-9.9-10.5-29.5-10.5-43.2 4.4-4.6 10.5 15.7 19.2 21.6l12.2 5.9c7 3.9 8.7 7.8 14 11.7l15.6 6c7 5.8 10.5 13.6 15.7 15.6 5.7 0 6.8-3.7 8.6-3.9 10.3-.6 15.5-2 17.5-5.5 2.1-2.8 7 1.6 21-4.3l-1.7-7.9s3.7-3.4 8.7-2c-.1-3.5-.5-13 4.5-17.4-3-3.5 1.8-9 2-10.7-1.4-8.6 1.4-8.7 2-11.3.6-2.5-2.4-1.7-1.6-5.2.9-3.5 6-4.3 6.6-7.2.7-2.9-1.1-14.3-1.3-16.8 9.4-2.8 12.4-11.4 15.7-7.8C264 70 265.8 66 276.3 66c1.4-3.6-3.9-6.7-1.8-7.9 3.5-.5 6.1-.2 10.2 5.7 1.3 2 1.6-2.7 2.9-3.2s4.4-.5 4.9-2.8c.5-2.4 1.2-5.6 3-9.5 1.4-3.2 2.5 1.3 3.8 7.5 7.4.3 24 2.1 31 4.3 5.2 1.5 8.7-1.5 13.7-2.2 3.7 4.2 7.2 1 9.2 10 2.7 4.8 7.3.4 8.3 1.8 5.8 18.1 25.8 5.9 27.4 6.2 2.5 0 5.6 8 7.7 7.9 3.2-.6 2.3-3.1 5.2-2.1-.8 6.8 5.6 14.6 5.6 19.7 0 0 1.5.9 3-.6 1.4-1.6 2.7-5.4 4-5.3 3 .5 22 6 25.8 7.9 1.7 3.5 3.3 5.3 6.8 4.7 2.8 2.1.8 5 2.4 5.1 3.5-2 4.7-4 8.2-2.1 3.5 2 7 5.9 8.7 9.8 0 2-1.8 9.8 0 21.6.9 3.9 9.7 32.3 9.7 35.2 0 4-2.7 6-4.5 9.9 7 5.9 0 15.7-3.5 21.6 26.2 5.9 14 17.6 34.9 11.7-5.2 13.8-3.4 12.7 1.8 26.4-10.4 7.8-.2 10.2-7.1 20-.5.7 4.1 8.6 10.5 8.6-1.7 15.6-7 9.8-5.2 33.3-13.7-.3-8.2 17.6-17.4 15.7.5 11.2 5.2 12.2 3.4 23.5-7 2-7 2-10.4 7.9l-5.2-2c-1.8 9.8-5.3 11.8 0 21.6 0 0-6.8.2-8.8 0-.1 3.4 3 4.3 3.5 7.8-.2 1.4-9.9 7.6-17.4 7.9-2 4.8 5.2 10 4.8 12.4-8.2 1.8-11.8 13-11.8 13s4.2 2 3.5 4c-2.2-1.8-3.5-2-7-2-1.7.5-6 0-10 7.7-4.5 1.6-6.6 1-10 6-1.5-4.7-3.7.1-6.3 2-2.7 1.8-6.2 6.5-6.7 6.3.1-1.4 1.6-6.3 1.6-6.3L399 437c-.7.1-.5-5.7-2.2-5.5s-6.4 7.3-8 7.5-2.1-2.2-3.5-2-4 7.5-5 7.7c-1 .1-5-4.5-8.3-3.8-17.1 6.8-19.9-13.4-22.5-2-3.6-2.2-3-1-6.7.1-2.3.7-2.5-3.4-4.6-3.4-4.1.2-4 4.6-6.2 3.3-1.8-9.2-13-7.6-14-11.5s4.8-4 6.6-6.8c1.4-4-1.5-5.6 4.3-9.4 7.5-5.7 6.8-19.8 4.9-25.3 0 0-5.9-17.7-7-17.7-3.5-1-3.5 6.5-8.6 8.6-10.5 4-29-9.9-32.2-9.9-2.9 0-16.5 3.6-16-4-2 7.4-9.5 1.7-10 1.7-7 0-4.3 6.1-9 5.9-2.1-.8-23.6-2.3-23.6-2.3v4l-26.1-11.8c-10.5-4-5.3-13.7-22.7-7.8v-11.8h-8.7c3.5-23.6 0-11.8-1.8-33.4l-7 2c-7-10.6 9.8-8.6-5.2-15.7 0 0 .3-11.7-3.5-7.8-.7.5 1.8 5.8 1.8 5.8-14-2-17.4-5.8-17.4-21.5 0 0 11.4 1.8 10.4 0-1.6-3-3.7-22-3.4-23.4-.1-2.6 10.7-9 8.6-15.2 1.4-.6 5.3-.7 5.3-.7"
            />
            <path
              fill="none"
              stroke="#fff"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M595.5 297.6q-.9 2 .1 3.6c1.1-1.7.2-2.4 0-3.6zm-476-149.4s-3-.4-2.4 2.3c1-2 2.3-2.2 2.4-2.3zm-.3-6.4c-1.7 0-3.8-.2-3 2.5 1-2.1 3-2.4 3-2.5zm12.7 36.3s2.6-.2 2 2.5c-1-2-2-2.4-2-2.5z"
              transform="scale(.86021 .96774)"
            />
          </svg>
        </Flag>
        <Typography variant="text-compact">4 / 3</Typography>
      </FlexBox>
    </FlexBox>
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
      hideShadow
      role="img"
      aria-label="Brazil"
      className={s.stylized}
      size={64}
      style={
        {
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
      <Flag aria-hidden="true">
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
