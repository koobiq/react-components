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
import { AnimatedBackground, MyReactSelect } from '@/app/components';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

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
          control={(props) => <Button {...props}>Open</Button>}
        >
          <div>
            <Modal.Header>Modal</Modal.Header>
            <Modal.Body>
              <MyReactSelect options={options} isClearable />
            </Modal.Body>
          </div>
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
