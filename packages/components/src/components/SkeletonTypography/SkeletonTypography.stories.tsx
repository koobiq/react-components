import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Grid, GridItem } from '../Grid';
import { flex, spacing } from '../layout';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '../Modal';
import {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
} from '../SidePanel';
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
          <Typography variant="headline" className={spacing({ mbe: 'l' })}>
            Title
          </Typography>
          <Typography variant="title" className={spacing({ mbe: 'l' })}>
            Subtitle
          </Typography>
          <Typography variant="text-normal">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias cum
            deleniti ducimus, ea esse inventore obcaecati ratione repellendus
            repudiandae velit.
          </Typography>
        </GridItem>
        <GridItem>
          <Typography variant="headline" className={spacing({ mbe: 'l' })}>
            <SkeletonTypography inlineSize={200} />
          </Typography>
          <Typography variant="title" className={spacing({ mbe: 'l' })}>
            <SkeletonTypography inlineSize={180} />
          </Typography>
          <Typography variant="text-normal">
            <SkeletonTypography inlineSize="100%" rows={3} />
          </Typography>
        </GridItem>
      </Grid>
    );
  },
};

export const Example2: Story = {
  name: 'Example 2',
  render: function Render() {
    return (
      <div className={flex({ gap: 'm' })}>
        <Modal control={(props) => <Button {...props}>Modal</Button>}>
          <ModalHeader>
            <SkeletonTypography variant="inherit" inlineSize={100} />
          </ModalHeader>
          <ModalContent>
            <SkeletonBlock
              inlineSize="100%"
              blockSize={200}
              className={spacing({ mbe: 'm' })}
            />
            <SkeletonTypography variant="inherit" rows={10} />
          </ModalContent>
          <ModalFooter>
            <SkeletonBlock>
              <Button>Accept</Button>
            </SkeletonBlock>
            <SkeletonBlock>
              <Button>Close</Button>
            </SkeletonBlock>
          </ModalFooter>
        </Modal>
        <SidePanel control={(props) => <Button {...props}>SidePanel</Button>}>
          <SidePanelHeader>
            <SkeletonTypography variant="inherit" inlineSize={100} />
          </SidePanelHeader>
          <SidePanelContent>
            <SkeletonBlock
              inlineSize="100%"
              blockSize={200}
              className={spacing({ mbe: 'm' })}
            />
            <SkeletonTypography variant="inherit" rows={10} />
          </SidePanelContent>
          <SidePanelFooter>
            <SkeletonBlock>
              <Button>Accept</Button>
            </SkeletonBlock>
            <SkeletonBlock>
              <Button>Close</Button>
            </SkeletonBlock>
          </SidePanelFooter>
        </SidePanel>
      </div>
    );
  },
};
