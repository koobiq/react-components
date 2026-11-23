import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

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
}) => (
  <input
    aria-label="Value"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

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
