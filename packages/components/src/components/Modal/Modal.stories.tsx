import { useBoolean } from '@koobiq/react-core';
import type { StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Input } from '../Input';
import { spacing } from '../layout';
import { Textarea } from '../Textarea';
import { Toggle } from '../Toggle';

import { Modal, type ModalProps } from './index';
import { modalPropSize } from './index.js';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  subcomponents: {
    'Modal.Header': Modal.Header,
    'Modal.Body': Modal.Body,
    'Modal.Footer': Modal.Footer,
  },
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
            <Modal.Header>Create access group</Modal.Header>
            <Modal.Body>
              <Input
                label="Name"
                placeholder="Enter a name"
                className={spacing({ mbe: 'm' })}
                autoFocus
                isRequired
              />
              <Textarea
                placeholder="Enter a description"
                label="Description"
                rows={3}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={close}>Ok</Button>
              <Button onPress={close} variant="fade-contrast-filled">
                Cancel
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  },
};

export const Size: Story = {
  render: function Render(args: ModalProps) {
    return (
      <FlexBox gap="l">
        {modalPropSize.map((size) => (
          <Modal
            key={size}
            size={size}
            control={(props) => <Button {...props}>size = {size}</Button>}
            {...args}
          >
            {({ close }) => (
              <>
                <Modal.Header>I have a {size} size</Modal.Header>
                <Modal.Body>But there&#39;s nothing to say…</Modal.Body>
                <Modal.Footer>
                  <Button onPress={close}>Ok</Button>
                </Modal.Footer>
              </>
            )}
          </Modal>
        ))}
      </FlexBox>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args: ModalProps) {
    const [isOpen, { on, off, set }] = useBoolean(false);

    return (
      <>
        <Button onPress={on}>Open</Button>
        <Modal isOpen={isOpen} size="small" onOpenChange={set} {...args}>
          <Modal.Header>Create access group</Modal.Header>
          <Modal.Body>
            <Input
              label="Name"
              placeholder="Enter a name"
              className={spacing({ mbe: 'm' })}
              autoFocus
              isRequired
            />
            <Textarea
              placeholder="Enter a description"
              label="Description"
              rows={3}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={off}>Ok</Button>
            <Button variant="fade-contrast-filled" onPress={off}>
              Cancel
            </Button>
          </Modal.Footer>
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
            <Modal.Header>Adjust me</Modal.Header>
            <Modal.Body>
              <FlexBox gap="l" direction="column">
                <Toggle
                  isSelected={hideBackdrop}
                  onChange={setHideBackdrop.toggle}
                >
                  Hide the backdrop
                </Toggle>
                <Toggle
                  isSelected={hideCloseButton}
                  onChange={setHideCloseButton.toggle}
                >
                  Hide the close button
                </Toggle>
                <Toggle
                  isSelected={disableExitOnClickOutside}
                  onChange={setDisableExitOnClickOutside.toggle}
                >
                  Disable the exit by clicking from the outside
                </Toggle>
                <Toggle
                  isSelected={disableExitOnEscapeKeyDown}
                  onChange={setDisableExitOnEscapeKeyDown.toggle}
                >
                  Disable the exit by pressing ESC key
                </Toggle>
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
