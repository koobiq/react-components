import React from 'react';
import Image from 'next/image';
import {
  Link,
  Button,
  spacing,
  FlexBox,
  Provider,
  Typography,
} from '@koobiq/react-components';

import { IconCircleChevronRight16 } from '@koobiq/react-icons';

import logo from '../../public/koobiq.svg';

import s from './page.module.css';
import { AnimatedBackground } from '@/app/components';

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
          startIcon={<IconCircleChevronRight16 />}
        >
          Explore more
        </Button>
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
