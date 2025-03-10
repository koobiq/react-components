import { useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import { IconQuestionCircle24 } from '@koobiq/react-icons';
import type { StoryObj } from '@storybook/react';

import { Button, type ButtonProps } from '../Button';
import { Grid, GridItem } from '../Grid';
import { IconButton } from '../IconButton';
import { InputNumber } from '../InputNumber';
import { flex } from '../layout';
import { Typography } from '../Typography';

import {
  Tooltip,
  type TooltipPropPlacement,
  type TooltipProps,
  tooltipPropVariant,
} from './index';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,

  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: TooltipProps) => (
    <Tooltip
      control={() => (
        <IconButton>
          <IconQuestionCircle24 />
        </IconButton>
      )}
      {...args}
    >
      This is a tooltip
    </Tooltip>
  ),
};

export const Trigger: Story = {
  render: (args: TooltipProps) => (
    <div className={flex({ gap: 'l' })}>
      <Tooltip
        {...args}
        control={() => <Button variant="fade-contrast-filled">Hover me</Button>}
      >
        This is a tooltip
      </Tooltip>
      <Tooltip
        trigger="focus"
        {...args}
        control={() => <Button variant="fade-contrast-filled">Focus me</Button>}
      >
        This is a tooltip
      </Tooltip>
    </div>
  ),
};

export const Variant: Story = {
  render: (args: TooltipProps) => (
    <div className={flex({ gap: 'l' })}>
      {tooltipPropVariant.map((variant) => (
        <Tooltip
          key={variant}
          variant={variant}
          {...args}
          control={() => (
            <Button variant="fade-contrast-filled">{variant}</Button>
          )}
        >
          This is a tooltip
        </Tooltip>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: TooltipProps) => (
    <Tooltip
      control={() => <Button variant="fade-contrast-filled">Disabled</Button>}
      disabled
      {...args}
    >
      This is a tooltip
    </Tooltip>
  ),
};

export const Arrow: Story = {
  render: (args: TooltipProps) => (
    <Tooltip
      hideArrow
      {...args}
      control={() => <Button variant="fade-contrast-filled">Hover me</Button>}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi deserunt
      dolores expedita facilis quos rerum sint. Accusamus ad amet corporis,
      distinctio et, incidunt laboriosam laborum necessitatibus nisi obcaecati,
      omnis rem ullam! Dicta error hic magni natus placeat praesentium, ratione
      tenetur! Asperiores cum doloribus ducimus eius laborum nisi obcaecati
      quasi rerum?
    </Tooltip>
  ),
};

export const Delays: Story = {
  render: function Render(args: TooltipProps) {
    const [delay, setDelay] = useState<number>(600);
    const [closeDelay, setCloseDelay] = useState<number>(1200);

    return (
      <div
        className={flex({
          gap: 'xl',
          direction: 'column',
          alignItems: 'center',
        })}
      >
        <Tooltip
          delay={delay}
          closeDelay={closeDelay}
          {...args}
          control={() => (
            <Button variant="fade-contrast-filled">Hover me</Button>
          )}
        >
          This is a tooltip
        </Tooltip>
        <div className={flex({ gap: 'm' })}>
          <InputNumber
            label="delay"
            placeholder="delay"
            value={delay}
            onChange={setDelay}
          />
          <InputNumber
            label="closeDelay"
            placeholder="closeDelay"
            value={closeDelay}
            onChange={setCloseDelay}
          />
        </div>
      </div>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args: TooltipProps) {
    const anchorRef = useRef<HTMLParagraphElement | null>(null);
    const [open, { on, off, set }] = useBoolean(false);

    return (
      <>
        <div
          className={flex({
            gap: 'l',
            direction: 'column',
            alignItems: 'center',
          })}
          style={{ width: 240 }}
        >
          <Typography align="center" ref={anchorRef}>
            Drop anchor here
          </Typography>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={on}
            onHoverEnd={off}
          >
            Hover me
          </Button>
        </div>
        <Tooltip
          open={open}
          anchorRef={anchorRef}
          onOpenChange={(open) => set(open)}
          {...args}
        >
          This is a tooltip
        </Tooltip>
      </>
    );
  },
};

export const Placement: Story = {
  render: function Render(args: TooltipProps) {
    const [open, { on, off, set }] = useBoolean();
    const [placement, setPlacement] = useState<TooltipPropPlacement>();
    const anchorRef = useRef<HTMLElement | null>(null);

    const onHoverStart = (placement: TooltipPropPlacement) => {
      const fn: ButtonProps['onHoverStart'] = (e) => {
        on();
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
            onHoverStart={onHoverStart('top start')}
            onHoverEnd={off}
            fullWidth
          >
            top start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('top')}
            onHoverEnd={off}
            fullWidth
          >
            top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('top end')}
            onHoverEnd={off}
            fullWidth
          >
            top end
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('start top')}
            onHoverEnd={off}
            fullWidth
          >
            start top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('start')}
            onHoverEnd={off}
            fullWidth
          >
            start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('start bottom')}
            onHoverEnd={off}
            fullWidth
          >
            start bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('end top')}
            onHoverEnd={off}
            fullWidth
          >
            end top
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('end')}
            onHoverEnd={off}
            fullWidth
          >
            end
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('end bottom')}
            onHoverEnd={off}
            fullWidth
          >
            end bottom
          </Button>
        </GridItem>
        <GridItem colStart={{ xs: 1, m: 2 }}>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('bottom start')}
            onHoverEnd={off}
            fullWidth
          >
            bottom start
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('bottom')}
            onHoverEnd={off}
            fullWidth
          >
            bottom
          </Button>
        </GridItem>
        <GridItem>
          <Button
            variant="fade-contrast-filled"
            onHoverStart={onHoverStart('bottom end')}
            onHoverEnd={off}
            fullWidth
          >
            bottom end
          </Button>
        </GridItem>
        <Tooltip
          delay={0}
          closeDelay={0}
          open={open}
          onOpenChange={(open) => set(open)}
          placement={placement}
          anchorRef={anchorRef}
          {...args}
        >
          Check out my placement
        </Tooltip>
      </Grid>
    );
  },
};

export const Offsets: Story = {
  render: function Render(args: TooltipProps) {
    const [offset, setOffset] = useState<number>(50);
    const [crossOffset, setCrossOffset] = useState<number>(0);

    return (
      <div
        className={flex({
          gap: 'xl',
          direction: 'column',
          alignItems: 'center',
        })}
      >
        <Tooltip
          offset={offset}
          crossOffset={crossOffset}
          {...args}
          control={() => (
            <Button variant="fade-contrast-filled">Hover me</Button>
          )}
        >
          This is a tooltip
        </Tooltip>
        <div className={flex({ gap: 'm' })}>
          <InputNumber
            label="offest"
            placeholder="offset"
            value={offset}
            onChange={setOffset}
          />
          <InputNumber
            label="crossOffset"
            placeholder="crossOffset"
            value={crossOffset}
            onChange={setCrossOffset}
          />
        </div>
      </div>
    );
  },
};
