import { useRef, useState } from 'react';

import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { DescriptionList } from '../DescriptionList';
import { DropdownMenu } from '../DropdownMenu';
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import {
  InlineEdit,
  type InlineEditProps,
  type InlineEditSaveErrorContext,
} from '../index';
import { Input } from '../Input';
import { SelectNext } from '../SelectNext';
import { Tag } from '../Tag';
import { Textarea as TextareaComponent } from '../Textarea';

const meta = {
  title: 'Components/InlineEdit',
  component: InlineEdit,
  subcomponents: {
    'InlineEdit.Placeholder': InlineEdit.Placeholder,
  },
  tags: ['status:new', 'date:2026-11-20'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<InlineEditProps<string>>;

const selectItems = [{ name: 'Bruteforce' }, { name: 'DDoS' }, { name: 'DoS' }];

export const Controlled: Story = {
  render: function Render() {
    const [name, setName] = useState('Security team');
    const [displayName, setDisplayName] = useState(name);

    return (
      <div style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Name"
          label="Name"
          value={name}
          onChange={setName}
          onSaved={setDisplayName}
          renderView={() =>
            displayName || (
              <InlineEdit.Placeholder>Not filled</InlineEdit.Placeholder>
            )
          }
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Description"
        defaultValue="Monitors incidents"
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Description"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const InDescriptionList: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <DescriptionList style={{ inlineSize: 480 }} alignItems="center">
      {[
        ['country', 'Country', 'Spain'],
        ['capital', 'Capital', 'Madrid'],
        ['currency', 'Currency', 'Euro'],
      ].map(([id, name, value]) => (
        <DescriptionList.Group id={id} key={id}>
          <DescriptionList.Term>{name}</DescriptionList.Term>
          <DescriptionList.Description>
            <InlineEdit
              aria-label={name}
              defaultValue={value}
              renderView={(currentValue) => currentValue}
              renderEdit={({ value: draft, onChange }) => (
                <Input
                  aria-label={name}
                  value={draft}
                  onChange={onChange}
                  fullWidth
                />
              )}
            />
          </DescriptionList.Description>
        </DescriptionList.Group>
      ))}
    </DescriptionList>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Owner"
        label="Owner"
        defaultValue=""
        renderView={() => (
          <InlineEdit.Placeholder>Not assigned</InlineEdit.Placeholder>
        )}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Owner"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const Textarea: Story = {
  render: function Render() {
    const [description, setDescription] = useState('Monitors incidents');
    const [displayDescription, setDisplayDescription] = useState(description);

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Description"
          label="Description"
          value={description}
          onChange={setDescription}
          onSaved={setDisplayDescription}
          renderView={() => displayDescription}
          renderEdit={({ value, onChange }) => (
            <TextareaComponent
              aria-label="Description"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
        <span>Press Ctrl/Cmd+Enter to save.</span>
      </FlexBox>
    );
  },
};

export const Validation: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue=""
        validate={(value) => (value.trim() ? null : 'Name is required')}
        renderView={(value) =>
          value || <InlineEdit.Placeholder>Not filled</InlineEdit.Placeholder>
        }
        renderEdit={({ value, onChange, isInvalid }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            isInvalid={isInvalid}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

const delayOptions = [100, 250, 500, 3000];

export const SaveProgress: Story = {
  render: function Render() {
    const [delay, setDelay] = useState<string | number>(500);

    return (
      <FlexBox direction="column" gap="l" style={{ inlineSize: 320 }}>
        <FlexBox
          direction="column"
          gap="xs"
          style={{ alignSelf: 'flex-start' }}
        >
          <span>Server response time</span>
          <ButtonToggleGroup selectedKey={delay} onSelectionChange={setDelay}>
            {delayOptions.map((option) => (
              <ButtonToggle id={option} key={option}>
                {option} ms
              </ButtonToggle>
            ))}
          </ButtonToggleGroup>
        </FlexBox>
        <InlineEdit
          aria-label="Name"
          label="Name"
          defaultValue="Security team"
          showActions
          style={{ inlineSize: '100%' }}
          onSave={() =>
            new Promise((resolve) => {
              setTimeout(resolve, Number(delay));
            })
          }
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </FlexBox>
    );
  },
};

export const SaveError: Story = {
  render: function Render() {
    const attempts = useRef(0);
    const [name, setName] = useState('Security team');
    const [displayName, setDisplayName] = useState(name);
    const lastSavedName = useRef(name);

    const [saveError, setSaveError] =
      useState<InlineEditSaveErrorContext | null>(null);

    return (
      <FlexBox direction="column" gap="m" style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Name"
          label="Name"
          value={name}
          onChange={setName}
          showActions
          onSave={(nextValue) => {
            setDisplayName(nextValue);

            return new Promise((resolve, reject) => {
              attempts.current += 1;
              const attempt = attempts.current;

              setTimeout(
                () =>
                  attempt % 2 === 1
                    ? reject(new Error('Server is unavailable'))
                    : resolve(undefined),
                600
              );
            });
          }}
          renderView={() => displayName}
          onSaveError={setSaveError}
          onSaved={(savedValue) => {
            lastSavedName.current = savedValue;
            setSaveError(null);
          }}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
        <FlexBox gap="xs" role="group" aria-label="Save error actions">
          <Button
            variant="fade-contrast-filled"
            isDisabled={!saveError}
            onPress={() => saveError?.retrySave()}
          >
            Retry
          </Button>
          <Button
            variant="fade-contrast-filled"
            isDisabled={!saveError}
            onPress={() => saveError?.open()}
          >
            Edit
          </Button>
          <Button
            variant="fade-contrast-filled"
            isDisabled={!saveError}
            onPress={() => {
              saveError?.rollback();
              setDisplayName(lastSavedName.current);
              setSaveError(null);
            }}
          >
            Rollback
          </Button>
        </FlexBox>
      </FlexBox>
    );
  },
};

export const ActionMenu: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        menuAriaLabel="Value actions"
        menu={
          <DropdownMenu>
            <IconButton
              aria-label="Value actions"
              variant="fade-contrast"
              isCompact
            >
              <IconEllipsisHorizontal16 />
            </IconButton>
            <DropdownMenu.Popover>
              <DropdownMenu.Content>
                <DropdownMenu.Item id="duplicate">Duplicate</DropdownMenu.Item>
                <DropdownMenu.Item id="archive">Archive</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
        }
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const ActionButtons: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        showActions
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const InteractiveView: Story = {
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <InlineEdit
        aria-label="Team"
        label="Team"
        defaultValue="Security team"
        renderView={(value) => (
          <FlexBox gap="xs" alignItems="center">
            <a href="#team">{value}</a>
            <Tag allowsRemoving>On call</Tag>
          </FlexBox>
        )}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Team"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const SelectBasic: Story = {
  render: () => (
    <div style={{ inlineSize: 240 }}>
      <InlineEdit
        aria-label="Attack type"
        label="Attack type"
        defaultValue="Bruteforce"
        renderView={(value) => value}
        renderEdit={({ value, commit }) => (
          <SelectNext
            aria-label="Attack type"
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

export const SelectReset: Story = {
  render: () => (
    <div style={{ inlineSize: 240 }}>
      <InlineEdit
        aria-label="Attack type"
        label="Attack type"
        defaultValue="Bruteforce"
        renderView={(value) =>
          value === 'Not specified' ? (
            <InlineEdit.Placeholder>{value}</InlineEdit.Placeholder>
          ) : (
            value
          )
        }
        renderEdit={({ value, commit }) => (
          <SelectNext
            aria-label="Attack type"
            items={[{ name: 'Not specified' }, ...selectItems]}
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

export const SelectMultiline: Story = {
  render: () => (
    <div style={{ inlineSize: 280 }}>
      <InlineEdit
        aria-label="Attack types"
        label="Attack types"
        defaultValue={['Bruteforce']}
        renderView={(value) => value.join(', ')}
        renderEdit={({ value, onChange }) => (
          <SelectNext
            aria-label="Attack types"
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

export const Disabled: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        isDisabled
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const FixedWidth: Story = {
  render: () => (
    <FlexBox direction="column" gap="m">
      <div style={{ inlineSize: 240 }}>
        <InlineEdit
          aria-label="Default width"
          label="Default width"
          defaultValue="Security team"
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Default width"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
      <div style={{ inlineSize: 240 }}>
        <InlineEdit
          aria-label="Fixed width"
          label="Fixed width"
          defaultValue="Security team"
          editModeWidth={400}
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Fixed width"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
    </FlexBox>
  ),
};

export const ProgrammaticMode: Story = {
  render: function Render() {
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    return (
      <FlexBox direction="column" gap="m" style={{ inlineSize: 320 }}>
        <FlexBox gap="s">
          <Button onPress={() => setMode('edit')}>Edit</Button>
          <Button onPress={() => setMode('view')}>Close</Button>
        </FlexBox>
        <InlineEdit
          aria-label="Name"
          label="Name"
          mode={mode}
          onModeChange={setMode}
          defaultValue="Security team"
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </FlexBox>
    );
  },
};
