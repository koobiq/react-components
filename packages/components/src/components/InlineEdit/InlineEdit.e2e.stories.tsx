import { useState } from 'react';

import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { DescriptionList } from '../DescriptionList';
import { DropdownMenu } from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { Input } from '../Input';
import { SelectNext } from '../SelectNext';
import { Tag } from '../Tag';
import { Textarea } from '../Textarea';

import { InlineEdit, type InlineEditProps } from './index';
import {
  Controlled as ControlledStory,
  SaveError as SaveErrorStory,
  SaveProgress as SaveProgressStory,
  Textarea as TextareaStory,
} from './InlineEdit.stories';

const meta = {
  title: 'E2E/InlineEdit',
  component: InlineEdit,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof InlineEdit>;

export default meta;

type Story = StoryObj<typeof InlineEdit>;
type StringStory = StoryObj<InlineEditProps<string>>;

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

export const ViewOverflow: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        data-testid="overflow-root"
        defaultValue="asdasdasdasdasdasdkajsldkjasldkjasldkjaslkdjlaksjdlkajslkdjalskdjl"
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

export const ControlledViewInteraction: StringStory = {
  render: ControlledStory.render,
};

export const TextareaExampleInteraction: StringStory = {
  render: TextareaStory.render,
};

export const SaveProgressExampleInteraction: StringStory = {
  render: SaveProgressStory.render,
};

export const SaveErrorExampleInteraction: StringStory = {
  render: SaveErrorStory.render,
};

export const EditState: Story = {
  render: () => (
    <div
      data-testid="e2eScreenshotTarget"
      style={{ blockSize: 80, inlineSize: 320 }}
    >
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
    <div
      data-testid="e2eScreenshotTarget"
      style={{ blockSize: 48, inlineSize: 320 }}
    >
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
    <DescriptionList style={{ inlineSize: 480 }} alignItems="center">
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

const TabNavigationExample = () => {
  const [saveCount, setSaveCount] = useState(0);
  const onSaved = () => setSaveCount((count) => count + 1);

  return (
    <div style={{ display: 'grid', gap: 8, inlineSize: 320 }}>
      <button data-testid="tab-before" type="button">
        Before
      </button>
      <button disabled type="button">
        Disabled before
      </button>
      <button hidden type="button">
        Hidden before
      </button>
      {['first', 'second', 'third'].map((id, index) => (
        <InlineEdit
          aria-label={id}
          data-testid={`tab-${id}`}
          defaultValue={`${id} value`}
          defaultMode={index === 0 ? 'edit' : 'view'}
          key={id}
          onSaved={onSaved}
          renderView={renderView}
          renderEdit={renderEdit}
        />
      ))}
      <button disabled type="button">
        Disabled after
      </button>
      <button hidden type="button">
        Hidden after
      </button>
      <button data-testid="tab-after" type="button">
        After
      </button>
      <output data-testid="tab-save-count">{saveCount}</output>
    </div>
  );
};

export const TabNavigation: Story = {
  render: () => <TabNavigationExample />,
};

export const TabMiddleControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, inlineSize: 320 }}>
      <button data-testid="tab-before" type="button">
        Before
      </button>
      <InlineEdit
        aria-label="Middle controls"
        data-testid="tab-middle"
        defaultValue="Value"
        defaultMode="edit"
        renderView={renderView}
        renderEdit={({ value, onChange }) => (
          <>
            <input
              aria-label="First editor"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
            <input aria-label="Second editor" defaultValue="Other" />
          </>
        )}
      />
      <button data-testid="tab-after" type="button">
        After
      </button>
    </div>
  ),
};

const selectItems = [{ name: 'Bruteforce' }, { name: 'DDoS' }, { name: 'DoS' }];

export const SelectOpenState: Story = {
  render: () => (
    <div
      data-testid="e2eScreenshotTarget"
      style={{ blockSize: 200, inlineSize: 256, padding: 8 }}
    >
      <InlineEdit
        aria-label="Attack type"
        defaultValue="Bruteforce"
        defaultMode="edit"
        label="Attack type"
        renderView={renderView}
        renderEdit={({ value, commit }) => (
          <SelectNext
            aria-label="Attack type editor"
            items={selectItems}
            value={value}
            onChange={(next) => commit(next as string)}
            fullWidth
          >
            {(item) => (
              <SelectNext.Item id={item.name}>{item.name}</SelectNext.Item>
            )}
          </SelectNext>
        )}
      />
    </div>
  ),
};

export const SelectInteraction: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, inlineSize: 240 }}>
      <InlineEdit
        aria-label="Attack type"
        data-testid="select-root"
        defaultValue="Bruteforce"
        defaultMode="edit"
        label="Attack type"
        renderView={renderView}
        renderEdit={({ value, commit }) => (
          <SelectNext
            aria-label="Attack type editor"
            items={selectItems}
            value={value}
            onChange={(next) => commit(next as string)}
            fullWidth
          >
            {(item) => (
              <SelectNext.Item id={item.name}>{item.name}</SelectNext.Item>
            )}
          </SelectNext>
        )}
      />
      <button data-testid="select-after" type="button">
        After
      </button>
    </div>
  ),
};

export const SelectMultilineInteraction: Story = {
  render: () => (
    <div style={{ inlineSize: 280 }}>
      <InlineEdit
        aria-label="Attack types"
        data-testid="select-multiline-root"
        defaultValue={['Bruteforce']}
        defaultMode="edit"
        renderView={(value) => value.join(', ')}
        renderEdit={({ value, onChange }) => (
          <SelectNext
            aria-label="Attack types editor"
            items={selectItems}
            value={value}
            onChange={(next) => onChange(next as string[])}
            selectionMode="multiple"
            selectedTagsOverflow="multiline"
            fullWidth
          >
            {(item) => (
              <SelectNext.Item id={item.name}>{item.name}</SelectNext.Item>
            )}
          </SelectNext>
        )}
      />
    </div>
  ),
};

export const ValidationInteraction: Story = {
  render: () => (
    <div
      data-testid="validation-scroll-container"
      style={{ blockSize: 140, inlineSize: 320, overflow: 'auto' }}
    >
      <div style={{ blockSize: 220 }} />
      <InlineEdit
        aria-label="Required name"
        data-testid="validation-root"
        defaultValue=""
        defaultMode="edit"
        validate={(value) => (value ? null : 'Name is required')}
        renderView={renderView}
        renderEdit={({ value, onChange, isInvalid }) => (
          <Input
            aria-label="Required name editor"
            value={value}
            onChange={onChange}
            isInvalid={isInvalid}
            fullWidth
          />
        )}
      />
      <div style={{ blockSize: 400 }} />
    </div>
  ),
};

export const SaveProgressInteraction: Story = {
  render: () => (
    <div
      data-testid="e2eScreenshotTarget"
      style={{ inlineSize: 336, padding: 8 }}
    >
      <InlineEdit
        aria-label="Async value"
        data-testid="async-progress-root"
        defaultValue="Security team"
        defaultMode="view"
        onSave={() => new Promise(() => undefined)}
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <InlineEdit
        aria-label="Async labeled value"
        data-testid="async-progress-label-root"
        defaultValue="Security team"
        defaultMode="edit"
        label="Name"
        onSave={() => new Promise(() => undefined)}
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

export const SaveErrorInteraction: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Async value"
        data-testid="async-error-root"
        defaultValue="Security team"
        defaultMode="edit"
        onSave={() => Promise.reject(new Error('Server is unavailable'))}
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

const MenuInteractionExample = () => {
  const [action, setAction] = useState('');

  return (
    <div
      data-testid="e2eScreenshotTarget"
      style={{ display: 'grid', gap: 8, inlineSize: 336, padding: 8 }}
    >
      <InlineEdit
        aria-label="Disabled value"
        data-testid="menu-root"
        defaultValue="Security team"
        isDisabled
        menuAriaLabel="Value actions"
        menu={
          <DropdownMenu>
            <IconButton
              aria-label="Open value actions"
              variant="fade-contrast"
              isCompact
            >
              <IconEllipsisHorizontal16 />
            </IconButton>
            <DropdownMenu.Popover>
              <DropdownMenu.Content onAction={(key) => setAction(String(key))}>
                <DropdownMenu.Item id="duplicate">Duplicate</DropdownMenu.Item>
                <DropdownMenu.Item id="archive">Archive</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
        }
        renderView={renderView}
        renderEdit={renderEdit}
      />
      <output data-testid="menu-action">{action}</output>
    </div>
  );
};

export const MenuInteraction: Story = {
  render: () => <MenuInteractionExample />,
};

export const MenuHoverInteraction: Story = {
  render: () => (
    <div data-testid="e2eScreenshotTarget" style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Enabled value"
        data-testid="menu-hover-root"
        defaultValue="Security team"
        menuAriaLabel="Value actions"
        menu={
          <DropdownMenu>
            <IconButton
              aria-label="Open enabled value actions"
              variant="fade-contrast"
              isCompact
            >
              <IconEllipsisHorizontal16 />
            </IconButton>
            <DropdownMenu.Popover>
              <DropdownMenu.Content>
                <DropdownMenu.Item id="duplicate">Duplicate</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
        }
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

export const ActionsState: Story = {
  render: () => (
    <div
      data-testid="e2eScreenshotTarget"
      style={{ blockSize: 120, inlineSize: 320 }}
    >
      <InlineEdit
        defaultValue="Security team"
        defaultMode="edit"
        label="Name"
        showActions
        renderView={renderView}
        renderEdit={renderEdit}
      />
    </div>
  ),
};

const InteractiveViewExample = () => {
  const [showTag, setShowTag] = useState(true);
  const [showDynamicLink, setShowDynamicLink] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 16, inlineSize: 360 }}>
      <InlineEdit
        aria-label="Interactive team"
        data-testid="interactive-root"
        defaultValue="Security team"
        renderView={(value) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="#team">{value}</a>
            {showTag && (
              <Tag
                allowsRemoving
                slotProps={{
                  removeIcon: { onPress: () => setShowTag(false) },
                }}
              >
                On call
              </Tag>
            )}
          </div>
        )}
        renderEdit={renderEdit}
      />
      <button type="button" onClick={() => setShowDynamicLink(true)}>
        Add dynamic link
      </button>
      <InlineEdit
        aria-label="Dynamic team"
        data-testid="dynamic-interactive-root"
        defaultValue="Dynamic value"
        renderView={(value) =>
          showDynamicLink ? <a href="#dynamic">{value}</a> : value
        }
        renderEdit={renderEdit}
      />
    </div>
  );
};

export const InteractiveViewInteraction: Story = {
  render: () => <InteractiveViewExample />,
};
