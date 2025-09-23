'use client';

import React from 'react';
import Image from 'next/image';
import {
  Link,
  Button,
  spacing,
  FlexBox,
  Provider,
  Typography,
  Modal,
} from '@koobiq/react-components';

import { IconChevronCircleRight16 } from '@koobiq/react-icons';

import logo from '../../public/koobiq.svg';

import s from './page.module.css';
import { AnimatedBackground } from '@/app/components';

import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

// https://github.com/adobe/react-spectrum/commit/7639e566bf112a9d35b58f70337b5ef0a5cc30c6#diff-1f298aac6f125fa840689cf698417ff1ac709c74711145610b0b16993415a5cc
export default function Home() {
  return (
    <Provider>
      <AnimatedBackground />
      <div className={s.content}>
        <FlexBox gap="m" alignItems="center">
          <Image
            src={logo}
            width={24}
            height={24}
            alt="koobiq logo"
            className={spacing({ mie: 'xs' })}
          />
          <Typography as="h1" variant="headline" align="center">
            Koobiq&nbsp;
            <Typography color="contrast-secondary" as="span" variant="headline">
              + Next.js
            </Typography>
          </Typography>
        </FlexBox>
        <Typography variant="text-big" className={s.definition}>
          Koobiq React is an open-source design system for designers and
          developers, focused on designing products related to cybersecurity.
        </Typography>
        <Button
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          href="https://react.koobiq.io/"
          startIcon={<IconChevronCircleRight16 />}
        >
          Explore more
        </Button>
        <Modal
          size="small"
          control={(props) => (
            <Button {...props}>Create an access group</Button>
          )}
        >
          {({ close }) => (
            <>
              <Modal.Header>Create an access group</Modal.Header>
              <Modal.Body>
                <Select
                  options={options}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Optional: Adjust z-index for layering
                  }}
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
      </div>
      <div className={s.footer}>
        <Link
          href="https://react.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </Link>
        <Typography color="theme">•</Typography>
        <Link
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Next.js
        </Link>
      </div>
    </Provider>
  );
}
