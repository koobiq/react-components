import { Typography, useBreakpoints } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';

import { useThemeProvider } from '../DocContainer';

import classes from './FrameworkGuide.module.css';
import nextDark from './images/next-js-logo-dark.svg';
import nextLight from './images/next-js-logo-light.svg';
import vite from './images/vite-js-logo.svg';

export const FrameworkGuide = () => {
  const { s } = useBreakpoints();

  const { isDark } = useThemeProvider() || {};

  return (
    <div className={clsx(classes.templates, s && classes.s, 'sb-unstyled')}>
      <div className={classes.template}>
        <div className={classes.title}>
          <img
            alt="nextjs"
            src={isDark ? nextDark : nextLight}
            width={32}
            height={32}
          />
          <Typography variant="title" as="span">
            Next.js
          </Typography>
        </div>

        <Typography variant="text-big" as="span">
          A template for Next.js with Koobiq React
        </Typography>
        <a
          className={classes.link}
          href="/?path=/docs/templates-next-js--docs"
          aria-label="next-js"
        />
      </div>
      <div className={classes.template}>
        <div className={classes.title}>
          <img src={vite} width={32} height={32} alt="vitejs" />
          <Typography variant="title" as="span">
            Vite.js
          </Typography>
        </div>
        <Typography variant="text-big" as="span">
          A template for Vite with Koobiq React
        </Typography>
        <a
          className={classes.link}
          href="https://github.com/koobiq/react-components/tree/main/templates/vite/template"
          aria-label="vite-js"
        />
      </div>
    </div>
  );
};
