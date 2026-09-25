import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { FileUpload } from './index.js';
import type { FileUploadProps } from './index.js';

const meta = {
  title: 'E2E/FileUpload',
  component: FileUpload,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof FileUpload>;

type Item = { id: string; name: string; size: number };

type State = { title: string } & Partial<FileUploadProps<Item>>;

const report: Item = { id: 'report', name: 'report.pdf', size: 245760 };

// The drag-over state appears only during a real drag, so only the states set by props.
const states: State[] = [
  { title: 'empty' },
  { title: 'with file', items: [report] },
  { title: 'disabled', items: [report], isDisabled: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const modes: Partial<FileUploadProps<Item>>[] = [
  {},
  { allowsMultiple: true },
  { allowsMultiple: true, size: 'compact' },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {modes.flatMap((mode, index) =>
        states.map(({ title, ...state }) => (
          <FileUpload
            key={`${index}-${title}`}
            aria-label={title}
            style={{ inlineSize: 320 }}
            onRemove={() => {}}
            {...mode}
            {...state}
          >
            {(item: Item) => (
              <FileUpload.Item id={item.id} textValue={item.name}>
                <FileUpload.ItemIcon />
                <FileUpload.ItemContent>
                  <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
                  <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
                </FileUpload.ItemContent>
                <FileUpload.RemoveButton />
              </FileUpload.Item>
            )}
          </FileUpload>
        ))
      )}
    </E2eGrid>
  ),
};
