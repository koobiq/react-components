import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid, GridItem } from '../Grid';
import { spacing } from '../layout';
import { Modal } from '../Modal';
import { SidePanel } from '../SidePanel';
import { SkeletonBlock } from '../SkeletonBlock';
import { Typography } from '../Typography';

import type { SkeletonTypographyBaseProps } from './index';
import { SkeletonTypography } from './index';

const meta = {
  title: 'Components/SkeletonTypography',
  component: SkeletonTypography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof SkeletonTypography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: SkeletonTypographyBaseProps) => (
    <SkeletonTypography
      rows={4}
      inlineSize={300}
      variant="text-normal"
      {...args}
    />
  ),
};

export const Example1: Story = {
  name: 'Example 1',
  render: function Render() {
    return (
      <Grid cols={{ xs: 1, l: 2 }} gap="3xl">
        <GridItem>
          <FlexBox gap="s" direction="column" alignItems="stretch">
            <Typography variant="headline">Title</Typography>
            <Typography variant="title">Subtitle</Typography>
            <Typography variant="text-normal">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              cum deleniti ducimus, ea esse inventore obcaecati ratione
              repellendus repudiandae velit.
            </Typography>
          </FlexBox>
        </GridItem>
        <GridItem>
          <FlexBox gap="s" direction="column" alignItems="stretch">
            <Typography variant="headline">
              <SkeletonTypography inlineSize={90} />
            </Typography>
            <Typography variant="title">
              <SkeletonTypography inlineSize={120} />
            </Typography>
            <Typography variant="text-normal">
              <SkeletonTypography inlineSize="100%" rows={3} />
            </Typography>
          </FlexBox>
        </GridItem>
      </Grid>
    );
  },
};

export const Example2: Story = {
  name: 'Example 2',
  render: function Render() {
    return (
      <FlexBox gap="m">
        <Modal control={(props) => <Button {...props}>Modal</Button>}>
          <Modal.Header>
            <SkeletonTypography variant="inherit" inlineSize={100} />
          </Modal.Header>
          <Modal.Body>
            <SkeletonBlock
              inlineSize="100%"
              blockSize={200}
              className={spacing({ mbe: 'm' })}
            />
            <SkeletonTypography variant="inherit" rows={10} />
          </Modal.Body>
          <Modal.Footer>
            <SkeletonBlock>
              <Button>Accept</Button>
            </SkeletonBlock>
            <SkeletonBlock>
              <Button>Close</Button>
            </SkeletonBlock>
          </Modal.Footer>
        </Modal>
        <SidePanel control={(props) => <Button {...props}>SidePanel</Button>}>
          <SidePanel.Header>
            <SkeletonTypography variant="inherit" inlineSize={100} />
          </SidePanel.Header>
          <SidePanel.Body>
            <SkeletonBlock
              inlineSize="100%"
              blockSize={200}
              className={spacing({ mbe: 'm' })}
            />
            <SkeletonTypography variant="inherit" rows={10} />
          </SidePanel.Body>
          <SidePanel.Footer>
            <SkeletonBlock>
              <Button>Accept</Button>
            </SkeletonBlock>
            <SkeletonBlock>
              <Button>Close</Button>
            </SkeletonBlock>
          </SidePanel.Footer>
        </SidePanel>
      </FlexBox>
    );
  },
};
