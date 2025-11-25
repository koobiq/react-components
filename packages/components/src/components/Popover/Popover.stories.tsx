import { useRef, useState } from 'react';

import { capitalizeFirstLetter, useBoolean } from '@koobiq/react-core';
import { IconSparkles16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { PressEvent } from '../../types';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid, GridItem } from '../Grid';
import { InputNumber } from '../InputNumber';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import image from './__stories__/img.webp';
import { Popover, type PopoverPropPlacement, popoverPropSize } from './index';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: {
    'Popover.Header': Popover.Header,
    'Popover.Body': Popover.Body,
    'Popover.Footer': Popover.Footer,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Popover
      size="auto"
      control={(props) => <Button {...props}>Open</Button>}
      hideCloseButton
      {...args}
    >
      <Popover.Header>I&#39;m a popover!</Popover.Header>
    </Popover>
  ),
};

export const Arrow: Story = {
  render: (args) => (
    <Popover
      size="auto"
      control={(props) => <Button {...props}>Open</Button>}
      hideCloseButton
      hideArrow
      {...args}
    >
      <Popover.Header>I&#39;m a popover!</Popover.Header>
    </Popover>
  ),
};

export const Offsets: Story = {
  render: function Render(args) {
    const [offset, setOffset] = useState<number>(50);
    const [crossOffset, setCrossOffset] = useState<number>(0);

    return (
      <FlexBox gap="xl" direction="column" alignItems="center">
        <Popover
          size="auto"
          offset={offset}
          crossOffset={crossOffset}
          control={(props) => <Button {...props}>Open</Button>}
          hideCloseButton
          {...args}
        >
          <Popover.Header>I&#39;m a popover!</Popover.Header>
        </Popover>
        <FlexBox gap="m">
          <InputNumber
            label="offest"
            value={offset}
            placeholder="offset"
            onChange={setOffset}
          />
          <InputNumber
            label="crossOffset"
            value={crossOffset}
            placeholder="crossOffset"
            onChange={setCrossOffset}
          />
        </FlexBox>
      </FlexBox>
    );
  },
};

export const Size: Story = {
  render: function Render(args) {
    const text =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos ea eveniet ipsam, mollitia nemo perferendis, quisquam recusandae totam ullam unde velit vitae voluptatem, voluptates? At commodi incidunt quibusdam saepe? Ad dolorum ducimus exercitationem ipsa nisi numquam possimus quas sapiente, similique, totam, vero voluptatibus. Adipisci aspernatur eligendi explicabo id magni recusandae voluptate voluptatum! Alias aliquam amet aut, cum delectus distinctio doloribus eius eveniet excepturi fugiat fugit magni minima molestias nam necessitatibus nihil odit officia pariatur perferendis perspiciatis porro quaerat quam quidem quis quisquam recusandae reiciendis repellat repellendus repudiandae sequi suscipit tempore unde ut vel veritatis vitae voluptate? Fugit quia repellendus tempora!';

    return (
      <FlexBox
        gap="l"
        alignItems="center"
        direction={{ xs: 'column', m: 'row' }}
      >
        {popoverPropSize.map((size) => (
          <Popover
            key={size}
            size={size}
            control={(props) => <Button {...props}>size = {size}</Button>}
            {...args}
          >
            {({ close }) => (
              <>
                <Popover.Header>{capitalizeFirstLetter(size)}</Popover.Header>
                <Popover.Body>{text}</Popover.Body>
                <Popover.Footer>
                  <Button onPress={close}>Ok</Button>
                </Popover.Footer>
              </>
            )}
          </Popover>
        ))}
        <Popover
          size="50%"
          control={(props) => <Button {...props}>size = custom</Button>}
          {...args}
        >
          {({ close }) => (
            <>
              <Popover.Header>Custom size = 50%</Popover.Header>
              <Popover.Body>{text}</Popover.Body>
              <Popover.Footer>
                <Button onPress={close}>Ok</Button>
              </Popover.Footer>
            </>
          )}
        </Popover>
      </FlexBox>
    );
  },
};

export const Placement: Story = {
  render: function Render(args) {
    const [isOpen, { toggle, set }] = useBoolean();
    const [placement, setPlacement] = useState<PopoverPropPlacement>();
    const anchorRef = useRef<HTMLElement | null>(null);

    const handlePress =
      (placement: PopoverPropPlacement) => (e: PressEvent) => {
        toggle();
        setPlacement(placement);
        anchorRef.current = e.target as HTMLElement;
      };

    return (
      <Grid cols={{ xs: 3, m: 5 }} gap="l">
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('top start')}
            fullWidth
          >
            top start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('top')}
            fullWidth
          >
            top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('top end')}
            fullWidth
          >
            top end
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('start top')}
            fullWidth
          >
            start top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('start')}
            fullWidth
          >
            start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('start bottom')}
            fullWidth
          >
            start bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('end top')}
            fullWidth
          >
            end top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('end')}
            fullWidth
          >
            end
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('end bottom')}
            fullWidth
          >
            end bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('bottom start')}
            fullWidth
          >
            bottom start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('bottom')}
            fullWidth
          >
            bottom
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onPress={handlePress('bottom end')}
            fullWidth
          >
            bottom end
          </Button>
        </GridItem>
        <Popover
          isOpen={isOpen}
          size="auto"
          onOpenChange={set}
          placement={placement}
          anchorRef={anchorRef}
          hideCloseButton
          {...args}
        >
          <Popover.Body>Check out my placement</Popover.Body>
        </Popover>
      </Grid>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args) {
    const anchorRef = useRef<HTMLParagraphElement | null>(null);
    const [isOpen, { on, set }] = useBoolean(false);

    return (
      <>
        <FlexBox
          gap="l"
          direction="column"
          alignItems="center"
          style={{ inlineSize: 240 }}
        >
          <Typography align="center" ref={anchorRef}>
            Drop anchor here
          </Typography>
          <Button onPress={on}>Open</Button>
        </FlexBox>
        <Popover
          size="auto"
          isOpen={isOpen}
          onOpenChange={set}
          anchorRef={anchorRef}
          hideCloseButton
          {...args}
        >
          <Popover.Header>I&#39;m a popover!</Popover.Header>
        </Popover>
      </>
    );
  },
};

export const Hover: Story = {
  name: 'Mouse hover interaction',
  render: function Render(args) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, { on, off, set }] = useBoolean(false);

    return (
      <>
        <Button onHoverStart={on} onHoverEnd={off} ref={anchorRef}>
          Hover with a Popover
        </Button>
        <Popover
          size="auto"
          isOpen={isOpen}
          hideCloseButton
          onOpenChange={set}
          anchorRef={anchorRef}
          slotProps={{ backdrop: { hidden: true } }}
          isNonModal
          {...args}
        >
          <div style={{ padding: 16 }}>I use Popover</div>
        </Popover>
      </>
    );
  },
};

export const ShouldCloseOnInteractOutside: Story = {
  name: 'Click outside exceptions',
  render: function Render(args) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, { toggle, set }] = useBoolean(false);

    return (
      <>
        <Button onPress={toggle} ref={anchorRef}>
          {isOpen ? 'Close' : 'Open'}
        </Button>
        <Popover
          size="auto"
          isOpen={isOpen}
          onOpenChange={set}
          anchorRef={anchorRef}
          slotProps={{ backdrop: { hidden: true } }}
          shouldCloseOnInteractOutside={(e) => !anchorRef.current?.contains(e)}
          hideCloseButton
          {...args}
        >
          <div style={{ padding: 16 }}>I use Popover</div>
        </Popover>
      </>
    );
  },
};

export const Customization: Story = {
  render: (args) => (
    <Popover
      offset={8}
      control={(props) => (
        <Button startIcon={<IconSparkles16 />} {...props}>
          Make magic
        </Button>
      )}
      {...args}
    >
      {({ close }) => (
        <>
          <img
            src={image}
            alt="header"
            height={160}
            style={{ objectFit: 'cover' }}
          />
          <div className={spacing({ p: 'l', pbe: 'xxl' })}>
            <FlexBox gap="l" direction="column" alignItems="center">
              <Typography variant="title">Abracadabra!</Typography>
              <Typography
                align="center"
                variant="text-big"
                color="contrast-secondary"
              >
                Now you&#39;re 99% more charming.
                <br />
                You&#39;re welcome. 😌✨
              </Typography>
              <Button variant="fade-contrast-filled" onPress={close}>
                Thanks
              </Button>
            </FlexBox>
          </div>
        </>
      )}
    </Popover>
  ),
};
