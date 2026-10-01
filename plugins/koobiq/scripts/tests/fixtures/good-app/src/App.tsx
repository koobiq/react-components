import { useState } from 'react';

import { IconChevronRight16 } from '@koobiq/react-icons';
import {
  Button,
  Checkbox,
  DatePicker,
  IconButton,
  Input,
  Link,
  Modal,
  SelectNext,
  Typography,
  toast,
  useLocale,
  type Key,
} from '@koobiq/react-components';
import { Markdown } from '@koobiq/react-components/markdown';

import styles from './App.module.css';

export function App() {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<Key | null>(null);
  const [remember, setRemember] = useState(false);
  const { locale } = useLocale();

  return (
    <div className={styles.root} lang={locale}>
      <Typography variant="headline">Settings</Typography>
      <Button
        variant="fade-contrast-filled"
        isLoading={false}
        onPress={() => toast.add({ title: 'Saved' })}
      >
        Save
      </Button>
      <IconButton aria-label="Next page">
        <IconChevronRight16 />
      </IconButton>
      <Input label="Name" value={value} onChange={setValue} />
      <Checkbox isSelected={remember} onChange={setRemember}>
        Remember me
      </Checkbox>
      <Link allowVisited href="/docs">
        Docs
      </Link>
      <DatePicker label="Date" />
      <SelectNext
        label="Role"
        selectedKey={selected as string}
        onSelectionChange={setSelected}
      />
      <Modal isOpen={false} onOpenChange={() => {}}>
        <Modal.Header>Title</Modal.Header>
      </Modal>
      <Markdown>{'# Docs'}</Markdown>
    </div>
  );
}
