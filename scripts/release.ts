import fs, { readFileSync, writeFileSync } from 'node:fs';

import dedent from 'ts-dedent';

import { version, firstRelease } from '../package.json';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');

  return [year, month, day].join('-');
};

const content = dedent(`
# Changelog

## ${version} (${getCurrentDate()})

- 🎉 first release!
`);

function createFirstChangelog() {
  fs.writeFileSync('CHANGELOG.md', content, {
    encoding: 'utf8',
    flag: 'w',
  });

  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

  packageJson.firstRelease = false;

  writeFileSync(`package.json`, JSON.stringify(packageJson, null, '\t'));
}

function postChangelog() {
  if (firstRelease) createFirstChangelog();
}

(() => {
  postChangelog();
})();
