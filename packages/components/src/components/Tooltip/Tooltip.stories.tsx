import { useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import { IconCircleQuestion24 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid, GridItem } from '../Grid';
import { IconButton } from '../IconButton';
import { InputNumber } from '../InputNumber';
import { Typography } from '../Typography';

import {
  Tooltip,
  tooltipPropVariant,
  type TooltipPropPlacement,
} from './index';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:updated', 'date:2026-05-15'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Tooltip
      control={(props) => (
        <IconButton {...props}>
          <IconCircleQuestion24 />
        </IconButton>
      )}
      {...args}
    >
      This is a tooltip
    </Tooltip>
  ),
};

export const Trigger: Story = {
  render: (args) => (
    <FlexBox gap="l">
      <Tooltip
        {...args}
        control={(props) => (
          <Button variant="fade-contrast-filled" {...props}>
            Hover me
          </Button>
        )}
      >
        This is a tooltip
      </Tooltip>
      <Tooltip
        trigger="focus"
        {...args}
        control={(props) => (
          <Button variant="fade-contrast-filled" {...props}>
            Focus me
          </Button>
        )}
      >
        This is a tooltip
      </Tooltip>
    </FlexBox>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox gap="l">
      {tooltipPropVariant.map((variant) => (
        <Tooltip
          key={variant}
          variant={variant}
          control={(props) => (
            <Button variant="fade-contrast-filled" {...props}>
              {variant}
            </Button>
          )}
          {...args}
        >
          This is a tooltip
        </Tooltip>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Tooltip
      control={(props) => (
        <Button variant="fade-contrast-filled" {...props}>
          Disabled
        </Button>
      )}
      isDisabled
      {...args}
    >
      This is a tooltip
    </Tooltip>
  ),
};

export const Arrow: Story = {
  render: (args) => (
    <Tooltip
      control={(props) => (
        <Button variant="fade-contrast-filled" {...props}>
          Hover me
        </Button>
      )}
      hideArrow={false}
      {...args}
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
  render: function Render(args) {
    const [delay, setDelay] = useState<number>(600);
    const [closeDelay, setCloseDelay] = useState<number>(1200);

    return (
      <FlexBox gap="xl" direction="column" alignItems="center">
        <Tooltip
          delay={delay}
          closeDelay={closeDelay}
          {...args}
          control={(props) => (
            <Button variant="fade-contrast-filled" {...props}>
              Hover me
            </Button>
          )}
        >
          This is a tooltip
        </Tooltip>
        <FlexBox gap="m">
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
        </FlexBox>
      </FlexBox>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args) {
    const anchorRef = useRef<HTMLParagraphElement | null>(null);
    const [isOpen, { on, off, set }] = useBoolean(false);

    return (
      <>
        <FlexBox
          gap="l"
          direction="column"
          alignItems="center"
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
        </FlexBox>
        <Tooltip
          isOpen={isOpen}
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
  render: (args) => {
    const placements: TooltipPropPlacement[] = [
      'top start',
      'top',
      'top end',
      'start top',
      'start',
      'start bottom',
      'end top',
      'end',
      'end bottom',
      'bottom start',
      'bottom',
      'bottom end',
    ];

    return (
      <Grid cols={{ xs: 3, m: 5 }} gap="l">
        {placements.map((placement, index) => (
          <GridItem
            key={placement}
            colStart={index % 3 === 0 ? { xs: 1, m: 2 } : undefined}
          >
            <Tooltip
              delay={0}
              closeDelay={0}
              hideArrow={false}
              placement={placement}
              control={(props) => (
                <Button variant="fade-contrast-filled" fullWidth {...props}>
                  {placement}
                </Button>
              )}
              {...args}
            >
              Check out my placement
            </Tooltip>
          </GridItem>
        ))}
      </Grid>
    );
  },
};

export const Offsets: Story = {
  render: function Render(args) {
    const [offset, setOffset] = useState<number>(50);
    const [crossOffset, setCrossOffset] = useState<number>(0);

    return (
      <FlexBox gap="xl" direction="column" alignItems="center">
        <Tooltip
          offset={offset}
          crossOffset={crossOffset}
          control={(props) => (
            <Button variant="fade-contrast-filled" {...props}>
              Hover me
            </Button>
          )}
          {...args}
        >
          This is a tooltip
        </Tooltip>
        <FlexBox gap="m">
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
        </FlexBox>
      </FlexBox>
    );
  },
};

export const PortalContainer: Story = {
  name: 'Portal container',
  render: function Render(args) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div
        ref={setContainer}
        style={{
          width: 100,
          height: 100,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {container && (
          <Tooltip
            portalContainer={container}
            control={(props) => <Typography {...props}>Hover me</Typography>}
            {...args}
          >
            Tooltip
          </Tooltip>
        )}
      </div>
    );
  },
};
