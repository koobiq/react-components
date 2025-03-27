import {
  type ComponentProps,
  type CSSProperties,
  type FC,
  type MouseEvent,
  useState,
} from 'react';

import {
  IconArrowUpFromBracket16,
  IconArrowUpRightFromSquare16,
  IconChevronDown16,
  IconPlus16,
} from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';

import { type ButtonBaseProps, buttonPropVariant } from './index.js';
import { Button } from './index.js';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
    endIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ButtonBaseProps) => (
    // eslint-disable-next-line no-alert
    <Button onClick={() => alert('Click')} {...args}>
      Button
    </Button>
  ),
};

export const WithIcons: Story = {
  render: (args: ButtonBaseProps) => (
    <Button
      startIcon={<IconPlus16 />}
      endIcon={<IconChevronDown16 />}
      {...args}
    >
      Button
    </Button>
  ),
};

export const OnlyIcon: Story = {
  render: (args: ButtonBaseProps) => (
    <FlexBox gap="l">
      {buttonPropVariant.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          aria-label="Add"
          startIcon={<IconPlus16 />}
          onlyIcon
          {...args}
        />
      ))}
    </FlexBox>
  ),
};

export const Progress: Story = {
  render: (args: ButtonBaseProps) => (
    <Button progress {...args}>
      Button
    </Button>
  ),
};

export const Variant: Story = {
  render: (args: ButtonBaseProps) => (
    <FlexBox gap="l" direction="column" alignItems="stretch">
      {buttonPropVariant.map((variant) => (
        <Button
          startIcon={<IconPlus16 />}
          key={variant}
          variant={variant}
          {...args}
        >
          variant = {variant}
        </Button>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: function Render(args: ButtonBaseProps) {
    const [checked, setChecked] = useState(false);

    return (
      <FlexBox gap="l" direction="column">
        <Button progress={checked} disabled {...args}>
          Button
        </Button>
        <Checkbox checked={checked} onChange={setChecked}>
          Progress
        </Checkbox>
      </FlexBox>
    );
  },
};

export const LongLabel: Story = {
  render: (args: ButtonBaseProps) => (
    <FlexBox style={{ inlineSize: 240 }}>
      <Button startIcon={<IconPlus16 />} {...args}>
        A very, very, very long label inside the button
      </Button>
    </FlexBox>
  ),
};

export const FullWidth: Story = {
  render: (args: ButtonBaseProps) => (
    <FlexBox style={{ inlineSize: 240 }}>
      <Button startIcon={<IconPlus16 />} fullWidth {...args}>
        Button
      </Button>
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: () => {
    const VisuallyHiddenInput: FC<ComponentProps<'input'>> = (props) => {
      const inputStyle = {
        inset: 0,
        blockSize: 1,
        inlineSize: 1,
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        clipPath: 'inset(50%)',
      } as CSSProperties;

      return <input style={inputStyle} {...props} />;
    };

    return (
      <FlexBox gap="l">
        <Button as="a" href="#" endIcon={<IconArrowUpRightFromSquare16 />}>
          Link
        </Button>
        <Button
          as="label"
          tabIndex={-1}
          startIcon={<IconArrowUpFromBracket16 />}
          onMouseDown={(e: MouseEvent<HTMLLabelElement>) => e.preventDefault()}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
      </FlexBox>
    );
  },
};
