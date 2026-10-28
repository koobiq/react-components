import { useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog'; // expect: import/other-ui-kit
import { ChevronRight } from 'lucide-react'; // expect: import/other-icons
import { Markdown } from '@koobiq/react-components/markdown'; // expect: setup/missing-optional-peer
import { isBrowser } from '@koobiq/react-core'; // expect: import/internal-layer
import {
  Button as KButton,
  Checkbox,
  DatePicker,
  IconButton,
  Input,
  Link,
  ModalHeader, // expect: deprecated/component
  Select, // expect: deprecated/component
  Buton, // expect: import/unknown-export
  toast,
} from '@koobiq/react-components';

import styles from './App.module.css';

export function App() {
  const [value, setValue] = useState('');
  const when = new Date().toLocaleDateString(); // expect: i18n/native-date-format

  toast.add({ title: 'Saved' }); // expect: setup/no-toast-provider

  return (
    <div className={styles.root} data-browser={isBrowser}>
      <KButton variant="primary" disabled onClick={() => setValue('')}> {/* expect: props/invalid-value, deprecated/prop, props/onclick */}
        Reset {when}
      </KButton>
      <IconButton> {/* expect: a11y/icon-button-label */}
        <ChevronRight />
      </IconButton>
      <Input value={value} /> {/* expect: props/controlled-without-handler, a11y/field-label */}
      <Input defaultValue="a" value={value} onChange={setValue} label="Name" /> {/* expect: props/value-and-default */}
      <Checkbox checked /> {/* expect: deprecated/prop, a11y/field-label */}
      <Link visitable href="/docs">Docs</Link> {/* expect: deprecated/prop */}
      <DatePicker label="Date" slotProps={{ label: {} }} /> {/* expect: deprecated/prop */}
      <button type="button" onClick={() => setValue('x')}>Raw</button> {/* expect: component/raw-element */}
      <input type="hidden" name="token" />
      <a href="https://example.com">External</a> {/* expect: component/raw-element */}
      <div className="kbq-button-5c3f2a">hack</div> {/* expect: style/hashed-class */}
      <div style={{ color: '#ffffff', zIndex: 9999 }} /> {/* expect: style/hardcoded-color, style/hardcoded-z-index */}
      <div style={{ borderColor: 'var(--kbq-line-contrast-lessx)' }} /> {/* expect: token/unknown */}
      <Dialog.Root />
      <Select />
      <Markdown>{'# hi'}</Markdown>
      <ModalHeader>Title</ModalHeader>
    </div>
  );
}
