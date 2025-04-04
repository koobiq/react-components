import { useRef, useState } from 'react';

import { capitalizeFirstLetter, useBoolean } from '@koobiq/react-core';
import { IconSparkles16 } from '@koobiq/react-icons';
import type { StoryObj } from '@storybook/react';

import { Button, type ButtonPropOnClick } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid, GridItem } from '../Grid';
import { InputNumber } from '../InputNumber';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import image from './__stories__/img.webp';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  popoverPropSize,
  type PopoverPropPlacement,
} from './index';
import type { PopoverProps } from './index.js';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: { PopoverHeader, PopoverContent, PopoverFooter },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: PopoverProps) => (
    <Popover
      size="auto"
      hideCloseButton
      {...args}
      control={(props) => <Button {...props}>Open</Button>}
    >
      <PopoverHeader>I&#39;m a popover!</PopoverHeader>
    </Popover>
  ),
};

export const Arrow: Story = {
  render: (args: PopoverProps) => (
    <Popover
      size="auto"
      hideCloseButton
      hideArrow
      {...args}
      control={(props) => <Button {...props}>Open</Button>}
    >
      <PopoverHeader>I&#39;m a popover!</PopoverHeader>
    </Popover>
  ),
};

export const Offsets: Story = {
  render: function Render(args: PopoverProps) {
    const [offset, setOffset] = useState<number>(50);
    const [crossOffset, setCrossOffset] = useState<number>(0);

    return (
      <FlexBox gap="xl" direction="column" alignItems="center">
        <Popover
          size="auto"
          offset={offset}
          crossOffset={crossOffset}
          hideCloseButton
          {...args}
          control={(props) => <Button {...props}>Open</Button>}
        >
          <PopoverHeader>I&#39;m a popover!</PopoverHeader>
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
  render: function Render(args: PopoverProps) {
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
                <PopoverHeader>{capitalizeFirstLetter(size)}</PopoverHeader>
                <PopoverContent>{text}</PopoverContent>
                <PopoverFooter>
                  <Button onClick={close}>Ok</Button>
                </PopoverFooter>
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
              <PopoverHeader>Custom size = 50%</PopoverHeader>
              <PopoverContent>{text}</PopoverContent>
              <PopoverFooter>
                <Button onClick={close}>Ok</Button>
              </PopoverFooter>
            </>
          )}
        </Popover>
      </FlexBox>
    );
  },
};

export const Placement: Story = {
  render: function Render(args: PopoverProps) {
    const [open, { toggle, set }] = useBoolean();
    const [placement, setPlacement] = useState<PopoverPropPlacement>();
    const anchorRef = useRef<HTMLElement | null>(null);

    const handleClick = (placement: PopoverPropPlacement) => {
      const fn: ButtonPropOnClick = (e) => {
        toggle();
        setPlacement(placement);
        anchorRef.current = e.target as HTMLElement;
      };

      return fn;
    };

    return (
      <Grid cols={{ xs: 3, m: 5 }} gap="l">
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('top start')}
            fullWidth
          >
            top start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('top')}
            fullWidth
          >
            top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('top end')}
            fullWidth
          >
            top end
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('start top')}
            fullWidth
          >
            start top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('start')}
            fullWidth
          >
            start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('start bottom')}
            fullWidth
          >
            start bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('end top')}
            fullWidth
          >
            end top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('end')}
            fullWidth
          >
            end
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('end bottom')}
            fullWidth
          >
            end bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('bottom start')}
            fullWidth
          >
            bottom start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('bottom')}
            fullWidth
          >
            bottom
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onClick={handleClick('bottom end')}
            fullWidth
          >
            bottom end
          </Button>
        </GridItem>
        <Popover
          open={open}
          size="auto"
          onOpenChange={set}
          placement={placement}
          anchorRef={anchorRef}
          hideCloseButton
          {...args}
        >
          <PopoverContent>Check out my placement</PopoverContent>
        </Popover>
      </Grid>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args: PopoverProps) {
    const anchorRef = useRef<HTMLParagraphElement | null>(null);
    const [open, { on, set }] = useBoolean(false);

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
          <Button onClick={on}>Open</Button>
        </FlexBox>
        <Popover
          size="auto"
          open={open}
          onOpenChange={set}
          anchorRef={anchorRef}
          hideCloseButton
          {...args}
        >
          <PopoverHeader>I&#39;m a popover!</PopoverHeader>
        </Popover>
      </>
    );
  },
};

export const Hover: Story = {
  name: 'Mouse hover interaction',
  render: function Render(args: PopoverProps) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, { on, off, set }] = useBoolean(false);

    return (
      <>
        <Button onHoverStart={on} onHoverEnd={off} ref={anchorRef}>
          Hover with a Popover
        </Button>
        <Popover
          size="auto"
          open={open}
          hideCloseButton
          onOpenChange={set}
          anchorRef={anchorRef}
          slotProps={{ backdrop: { hidden: true } }}
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
  render: function Render(args: PopoverProps) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, { toggle, set }] = useBoolean(false);

    return (
      <>
        <Button onClick={toggle} ref={anchorRef}>
          {open ? 'Close' : 'Open'}
        </Button>
        <Popover
          size="auto"
          open={open}
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
  render: (args: PopoverProps) => (
    <Popover
      offset={8}
      {...args}
      control={(props) => (
        <Button startIcon={<IconSparkles16 />} {...props}>
          Make magic
        </Button>
      )}
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
              <Button variant="fade-contrast-filled" onClick={close}>
                Thanks
              </Button>
            </FlexBox>
          </div>
        </>
      )}
    </Popover>
  ),
};
