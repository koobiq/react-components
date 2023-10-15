import React from 'react';
import Image from 'next/image';
import {
  Button,
  Typography,
  Link,
  spacing,
  flex,
  Provider,
} from '@koobiq/react-components';

import { IconChevronCircleRight16 } from '@koobiq/react-icons';

import logo from '../../public/koobiq.svg';

const FIGMA_URL =
  'https://www.figma.com/files/1227251916042954276/project/84583639?fuid=1426165683279684887';

import s from './page.module.css';
import { ThemeSwitch } from '@/app/components';

export default function Home() {
  return (
    <Provider>
      <header className={s.header}>
        <ThemeSwitch />
      </header>
      <div className={s.body}>
        <div
          className={flex({
            gap: 's',
            direction: 'column',
            alignItems: 'center',
          })}
        >
          <Image
            src={logo}
            width={40}
            height={40}
            alt="koobiq logo"
            className={spacing({ m: 'm' })}
          />
          <Typography as="h1" variant="display-compact-strong" align="center">
            Koobiq React
          </Typography>
          <Typography variant="headline" align="center">
            Next.js
          </Typography>
        </div>
        <Button
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          href="https://react.koobiq.io/"
          startIcon={<IconChevronCircleRight16 />}
        >
          Visit the website
        </Button>
        <Link
          href={FIGMA_URL}
          target="_blank"
          variant="text-big"
          rel="noopener noreferrer"
        >
          Koobiq for Figma
        </Link>
      </div>
    </Provider>
  );
}
