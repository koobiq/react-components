import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Input } from '../Input';
import { flex, spacing } from '../layout';
import { Textarea } from '../Textarea';
import { Toggle } from '../Toggle';

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalPropControl,
  type ModalProps,
  type ModalPropSize,
} from './index';
import { modalPropSize } from './index.js';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  subcomponents: { ModalHeader, ModalContent, ModalFooter },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args: ModalProps) {
    return (
      <Modal
        size="small"
        control={(props) => <Button {...props}>Create access group</Button>}
        {...args}
      >
        {({ close }) => (
          <>
            <ModalHeader>Create access group</ModalHeader>
            <ModalContent>
              <Input
                label="Name"
                placeholder="Enter a name"
                className={spacing({ mbe: 'm' })}
                autoFocus
                required
              />
              <Textarea
                placeholder="Enter a description"
                label="Description"
                rows={3}
              />
            </ModalContent>
            <ModalFooter>
              <Button onClick={close}>Ok</Button>
              <Button variant="fade-contrast-filled" onClick={close}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    );
  },
};

export const Size: Story = {
  render: function Render(args: ModalProps) {
    const [size, setSize] = useState<ModalPropSize>();

    const control: ModalPropControl = ({ onClick, ...other }) => (
      <div className={flex({ gap: 'l' })}>
        {modalPropSize.map((size) => (
          <Button
            onClick={(e) => {
              onClick?.(e);
              setSize(size);
            }}
            key={size}
            {...other}
          >
            size = {size}
          </Button>
        ))}
      </div>
    );

    return (
      <Modal size={size} control={control} {...args}>
        {({ close }) => (
          <>
            <ModalHeader>I have a {size} size</ModalHeader>
            <ModalContent>But there&#39;s nothing to say…</ModalContent>
            <ModalFooter>
              <Button onClick={close}>Ok</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args: ModalProps) {
    const [open, { on, off, set }] = useBoolean(false);

    return (
      <>
        <Button onClick={on}>Open</Button>
        <Modal open={open} size="small" onOpenChange={set} {...args}>
          <ModalHeader>Create access group</ModalHeader>
          <ModalContent>
            <Input
              label="Name"
              placeholder="Enter a name"
              className={spacing({ mbe: 'm' })}
              autoFocus
              required
            />
            <Textarea
              placeholder="Enter a description"
              label="Description"
              rows={3}
            />
          </ModalContent>
          <ModalFooter>
            <Button onClick={off}>Ok</Button>
            <Button variant="fade-contrast-filled" onClick={off}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const Settings: Story = {
  render: function Render() {
    const [hideBackdrop, setHideBackdrop] = useBoolean(false);
    const [hideCloseButton, setHideCloseButton] = useBoolean(false);

    const [disableExitOnClickOutside, setDisableExitOnClickOutside] =
      useBoolean(false);

    const [disableExitOnEscapeKeyDown, setDisableExitOnEscapeKeyDown] =
      useBoolean(false);

    return (
      <Modal
        size="small"
        hideBackdrop={hideBackdrop}
        hideCloseButton={hideCloseButton}
        disableExitOnClickOutside={disableExitOnClickOutside}
        disableExitOnEscapeKeyDown={disableExitOnEscapeKeyDown}
        control={(props) => <Button {...props}>Adjust me</Button>}
      >
        {({ close }) => (
          <>
            <ModalHeader>Adjust me</ModalHeader>
            <ModalContent>
              <div className={flex({ direction: 'column', gap: 'l' })}>
                <Toggle
                  checked={hideBackdrop}
                  onChange={setHideBackdrop.toggle}
                >
                  Hide the backdrop
                </Toggle>
                <Toggle
                  checked={hideCloseButton}
                  onChange={setHideCloseButton.toggle}
                >
                  Hide the close button
                </Toggle>
                <Toggle
                  checked={disableExitOnClickOutside}
                  onChange={setDisableExitOnClickOutside.toggle}
                >
                  Disable the exit by clicking from the outside
                </Toggle>
                <Toggle
                  checked={disableExitOnEscapeKeyDown}
                  onChange={setDisableExitOnEscapeKeyDown.toggle}
                >
                  Disable the exit by pressing ESC key
                </Toggle>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={close}>Ok</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    );
  },
};
