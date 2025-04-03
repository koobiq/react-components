import {
  Link,
  Button,
  spacing,
  FlexBox,
  Provider,
  Typography,
} from '@koobiq/react-components';
import {
  IconSun16,
  IconSunMoon16,
  IconChevronCircleRight16,
} from '@koobiq/react-icons';

import s from './App.module.css';
import logo from './assets/koobiq.svg';
import { useTheme } from './components';

const FIGMA_URL =
  'https://www.figma.com/files/1227251916042954276/project/84583639?fuid=1426165683279684887';

export default function App() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'kbq-dark';

  return (
    <Provider>
      <header className={s.header}>
        <Button
          variant="contrast-transparent"
          className={spacing({ mis: 'auto' })}
          startIcon={isDark ? <IconSun16 /> : <IconSunMoon16 />}
          onClick={() => setTheme(isDark ? 'kbq-light' : 'kbq-dark')}
          onlyIcon
        />
      </header>
      <div className={s.body}>
        <FlexBox gap="s" direction="column" alignItems="center">
          <img
            width={40}
            src={logo}
            height={40}
            alt="koobiq logo"
            className={spacing({ m: 'm' })}
          />
          <Typography variant="display-compact-strong" align="center">
            Koobiq React
          </Typography>
          <Typography variant="headline" align="center">
            Vite.js
          </Typography>
        </FlexBox>
        <Button
          as="a"
          target="_blank"
          href="https://react.koobiq.io/"
          startIcon={<IconChevronCircleRight16 />}
        >
          Visit the website
        </Button>
        <Link href={FIGMA_URL} target="_blank" variant="text-big">
          Koobiq for Figma
        </Link>
      </div>
    </Provider>
  );
}
