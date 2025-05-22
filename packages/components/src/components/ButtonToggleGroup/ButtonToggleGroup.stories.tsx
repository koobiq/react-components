import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
  IconBug16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Modal } from '../Modal';
import { Typography, type TypographyPropAlign } from '../Typography';

import type { ButtonToggleGroupBaseProps } from './index.js';
import { ButtonToggleGroup, ButtonToggle } from './index.js';

const meta = {
  title: 'Components/ButtonToggleGroup',
  component: ButtonToggleGroup,
  subcomponents: { ButtonToggle, ButtonToggleGroup },
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ButtonToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKey="center" {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const FullWidth: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <div style={{ inlineSize: 400 }}>
      <ButtonToggleGroup defaultSelectedKey="left" isBlock {...args}>
        <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
          Left
        </ButtonToggle>
        <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
          Center
        </ButtonToggle>
        <ButtonToggle id="right" icon={<IconAlignRight16 />}>
          Right
        </ButtonToggle>
      </ButtonToggleGroup>
    </div>
  ),
};

export const DisabledGroup: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKey="center" isDisabled {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const DisabledItem: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKey="center" {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />} isDisabled>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const EqualItemSize: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup
      defaultSelectedKey="first"
      style={{ inlineSize: 300 }}
      hasEqualItemSize
      {...args}
    >
      <ButtonToggle id="first" icon={<IconBug16 />}>
        First
      </ButtonToggle>
      <ButtonToggle id="second" icon={<IconBug16 />}>
        Second
      </ButtonToggle>
      <ButtonToggle id="third" icon={<IconBug16 />}>
        Third
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const LongText: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup
      defaultSelectedKey="first"
      style={{ inlineSize: 360 }}
      hasEqualItemSize
      {...args}
    >
      <ButtonToggle id="first" icon={<IconBug16 />}>
        First
      </ButtonToggle>
      <ButtonToggle id="second" icon={<IconBug16 />}>
        Second
      </ButtonToggle>
      <ButtonToggle id="third" icon={<IconBug16 />}>
        Lorem ipsum dolor sit amet.
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const Selection: Story = {
  render: function Render(args: ButtonToggleGroupBaseProps) {
    const [selected, setSelected] = useState<string | number>('center');

    return (
      <FlexBox direction="column" gap="l" style={{ width: 300 }}>
        <ButtonToggleGroup
          selectedKey={selected}
          onSelectionChange={setSelected}
          style={{ inlineSize: 'inherit' }}
          {...args}
        >
          <ButtonToggle id="start" icon={<IconAlignLeft16 />}>
            Left
          </ButtonToggle>
          <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
            Center
          </ButtonToggle>
          <ButtonToggle id="end" icon={<IconAlignRight16 />}>
            Right
          </ButtonToggle>
        </ButtonToggleGroup>
        <Typography align={selected as TypographyPropAlign}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, quos!
        </Typography>
      </FlexBox>
    );
  },
};

export const Icon: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKey="left" hasEqualItemSize {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />} aria-label="left" />
      <ButtonToggle
        id="center"
        icon={<IconAlignCenter16 />}
        aria-label="center"
      />
      <ButtonToggle
        id="right"
        icon={<IconAlignRight16 />}
        aria-label="rigght"
      />
    </ButtonToggleGroup>
  ),
};

export const Playground: Story = {
  render: function Render(args: ButtonToggleGroupBaseProps) {
    const [isBlock, { set: setIsBlock }] = useBoolean(true);
    const [selected, setSelected] = useState<string | number>();
    const [hasEqualItemSize, { set: setHasEqualItemSize }] = useBoolean(true);

    return (
      <Modal control={(props) => <Button {...props}>Open</Button>}>
        {({ close }) => (
          <>
            <Modal.Header>Playground</Modal.Header>
            <Modal.Body>
              <ButtonToggleGroup
                isBlock={isBlock}
                defaultSelectedKey="first"
                hasEqualItemSize={hasEqualItemSize}
                {...args}
              >
                <ButtonToggle id="first" icon={<IconBug16 />}>
                  First
                </ButtonToggle>
                <ButtonToggle id="second" icon={<IconBug16 />}>
                  Second
                </ButtonToggle>
                <ButtonToggle id="third" icon={<IconBug16 />}>
                  Third
                </ButtonToggle>
              </ButtonToggleGroup>
              <ButtonToggleGroup
                isBlock={isBlock}
                selectedKey={selected}
                onSelectionChange={setSelected}
                hasEqualItemSize={hasEqualItemSize}
                className={spacing({ mbs: 'l' })}
                {...args}
              >
                <ButtonToggle
                  id="left"
                  icon={<IconAlignLeft16 />}
                  aria-label="left"
                />
                <ButtonToggle
                  id="center"
                  icon={<IconAlignCenter16 />}
                  aria-label="center"
                />
                <ButtonToggle
                  id="right"
                  icon={<IconAlignLeft16 />}
                  aria-label="right"
                >
                  Lorem ipsum dolor.
                </ButtonToggle>
              </ButtonToggleGroup>
              <div className={spacing({ mbs: 'l' })}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                dolor iusto possimus quisquam repellat! Consectetur neque non
                quia quod quos!
              </div>
              <FlexBox
                gap="m"
                direction="column"
                className={spacing({ mbs: 'l' })}
              >
                <Typography variant="text-normal-strong">Settings:</Typography>
                <FlexBox gap="m">
                  <Button onPress={() => setSelected('left')}>Left</Button>
                  <Button onPress={() => setSelected('center')}>Center</Button>
                  <Button onPress={() => setSelected('right')}>Right</Button>
                  <Button onPress={() => setSelected('none')}>None</Button>
                  <Button
                    variant="fade-contrast-filled"
                    onPress={() => setSelected('')}
                  >
                    Reset
                  </Button>
                </FlexBox>

                <Typography>Current key: {selected}</Typography>

                <FlexBox gap="m">
                  <Checkbox checked={isBlock} onChange={setIsBlock}>
                    isBlock
                  </Checkbox>
                  <Checkbox
                    checked={hasEqualItemSize}
                    onChange={setHasEqualItemSize}
                  >
                    hasEqualItemSize
                  </Checkbox>
                </FlexBox>
              </FlexBox>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={close}>Ok</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  },
};
