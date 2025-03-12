import { Grid, GridItem, Typography } from '@koobiq/react-components';

import classes from './Issues.module.css';

export const Issues = () => (
  <Grid gap="xl" cols={{ xs: 1, s: 2 }} className="sb-unstyled">
    <GridItem>
      <div className={classes.template}>
        <div className={classes.title}>
          <Typography variant="title" as="span">
            🐞 Bug report
          </Typography>
        </div>
        <Typography as="span">
          Report a bug, it will help improve our library
        </Typography>
        <a
          className={classes.link}
          href="https://github.com/koobiq/react-components/issues/new?template=bug-report.yml"
          aria-label="bug report"
        />
      </div>
    </GridItem>
    <GridItem>
      <div className={classes.template}>
        <div className={classes.title}>
          <Typography variant="title" as="span">
            ❓Ask a question
          </Typography>
        </div>
        <Typography as="span">Ask any question about our library</Typography>
        <a
          className={classes.link}
          href="https://github.com/koobiq/react-components/issues/new?template=question.yml"
          aria-label="ask a question"
        />
      </div>
    </GridItem>
    <GridItem>
      <div className={classes.template}>
        <div className={classes.title}>
          <Typography variant="title" as="span">
            🚀 Propose an improvement
          </Typography>
        </div>
        <Typography as="span">
          Propose an improvement to be added to the library
        </Typography>
        <a
          className={classes.link}
          href="https://github.com/koobiq/react-components/issues/new?template=feature-request.yml"
          aria-label="propose an improvement"
        />
      </div>
    </GridItem>
  </Grid>
);
