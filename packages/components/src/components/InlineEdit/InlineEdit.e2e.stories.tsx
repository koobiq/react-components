import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { DescriptionList } from '../DescriptionList';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

import { InlineEdit } from './index';

const meta = {
  title: 'E2E/InlineEdit',
  component: InlineEdit,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof InlineEdit>;

export default meta;

type Story = StoryObj<typeof InlineEdit>;

const renderView = (value: string) => value || 'Not filled';

const renderEdit = ({
  value,
  onChange,
}: {
  value: string;
  onChange(value: string): void;
}) => <Input aria-label="Value" value={value} onChange={onChange} fullWidth />;

export const ViewStates: Story = {
  render: () => (
    <E2eGrid columns={2}>
      <InlineEdit
        defaultValue="Security team"
        label="Name"
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <InlineEdit
        defaultValue="Security team"
        label="Name"
        isDisabled
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <InlineEdit
        defaultValue=""
        label="Owner"
        renderView={() => (
          <InlineEdit.Placeholder>Not assigned</InlineEdit.Placeholder>
        )}
        renderEdit={renderEdit}
      />
      <InlineEdit
        defaultValue="Fixed width"
        editModeWidth={400}
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </E2eGrid>
  ),
};

export const EditState: Story = {
  render: () => (
    <div data-testid="e2eScreenshotTarget" style={{ inlineSize: 320 }}>
      <InlineEdit
        defaultValue="Security team"
        defaultMode="edit"
        label="Name"
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

export const EditStateWithoutLabel: Story = {
  render: () => (
    <div data-testid="e2eScreenshotTarget" style={{ inlineSize: 320 }}>
      <InlineEdit
        defaultValue="Security team"
        defaultMode="edit"
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

const OutsideInteractionExample = () => {
  const [controlledMode, setControlledMode] = useState<'view' | 'edit'>('view');
  const [saveCount, setSaveCount] = useState(0);

  const onSaved = () => setSaveCount((count) => count + 1);

  return (
    <div style={{ display: 'grid', gap: 16, inlineSize: 320 }}>
      <InlineEdit
        aria-label="Controlled"
        data-testid="controlled"
        mode={controlledMode}
        onModeChange={setControlledMode}
        defaultValue="Controlled value"
        onSaved={onSaved}
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <InlineEdit
        aria-label="Uncontrolled"
        data-testid="uncontrolled"
        defaultValue="Uncontrolled value"
        onSaved={onSaved}
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <button data-testid="outside-button" type="button">
        Outside
      </button>
      <div data-testid="outside-nonfocusable">Non-focusable outside</div>
      <output data-testid="save-count">{saveCount}</output>
    </div>
  );
};

export const OutsideInteraction: Story = {
  render: () => <OutsideInteractionExample />,
};

const TextareaInteractionExample = () => {
  const [savedValue, setSavedValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 16, inlineSize: 320 }}>
      <InlineEdit
        defaultValue="Monitors incidents"
        defaultMode="edit"
        onSaved={setSavedValue}
        renderView={renderView}
        renderEdit={({ value, onChange }) => (
          <Textarea
            aria-label="Value"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
      <output data-testid="saved-value">{savedValue}</output>
    </div>
  );
};

export const TextareaInteraction: Story = {
  render: () => <TextareaInteractionExample />,
};

export const ScrollInteraction: Story = {
  render: () => (
    <div
      data-testid="scroll-container"
      style={{ blockSize: 120, inlineSize: 320, overflow: 'auto' }}
    >
      <div style={{ blockSize: 80 }} />
      <InlineEdit
        aria-label="Scrollable value"
        data-testid="scroll-root"
        defaultValue="Security team"
        defaultMode="edit"
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <div style={{ blockSize: 400 }} />
    </div>
  ),
};

export const WindowScrollInteraction: Story = {
  render: () => (
    <div style={{ paddingBlockStart: 100 }}>
      <div style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Window scroll value"
          data-testid="window-scroll-root"
          defaultValue="Security team"
          defaultMode="edit"
          renderView={renderView}
          renderEdit={renderEdit}
        />
      </div>
      <div style={{ blockSize: 1000 }} />
    </div>
  ),
};

export const DescriptionListInteraction: Story = {
  render: () => (
    <DescriptionList style={{ inlineSize: 480 }}>
      <DescriptionList.Group id="country">
        <DescriptionList.Term>Country</DescriptionList.Term>
        <DescriptionList.Description>
          <InlineEdit
            aria-label="Country"
            data-testid="description-inline-edit"
            defaultValue="Spain"
            renderView={renderView}
            renderEdit={renderEdit}
          />
        </DescriptionList.Description>
      </DescriptionList.Group>
      <DescriptionList.Group id="capital">
        <DescriptionList.Term>Capital</DescriptionList.Term>
        <DescriptionList.Description>Madrid</DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};
