#!/usr/bin/env ts-node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';

// ESM-compatible __dirname
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const ALIASES: Record<string, string> = {
  IconAnomalySquare16: 'IconSquareA16',
  IconAnomalySquare24: 'IconSquareA24',
  IconArrowCircleDown16: 'IconCircleArrowDown16',
  IconArrowCircleDown24: 'IconCircleArrowDown24',
  IconArrowCircleLeft16: 'IconCircleArrowLeft16',
  IconArrowCircleLeft24: 'IconCircleArrowLeft24',
  IconArrowCircleRight16: 'IconCircleArrowRight16',
  IconArrowCircleRight24: 'IconCircleArrowRight24',
  IconArrowCircleUp16: 'IconCircleArrowUp16',
  IconArrowCircleUp24: 'IconCircleArrowUp24',
  IconArrowRightCircleDotO16: 'IconCircleArrowRightDotO16',
  IconArrowRightCircleDotO24: 'IconCircleArrowRightDotO24',
  IconBoltCircle16: 'IconCircleBolt16',
  IconBoltCircle24: 'IconCircleBolt24',
  IconBoltRectangleVertical16: 'IconRectangleVerticalBolt16',
  IconBoltRectangleVertical24: 'IconRectangleVerticalBolt24',
  IconBoltRectangleVerticalO16: 'IconRectangleVerticalBoltO16',
  IconBoltRectangleVerticalO24: 'IconRectangleVerticalBoltO24',
  IconCheckCircle16: 'IconCircleCheck16',
  IconCheckCircle24: 'IconCircleCheck24',
  IconChevronCircleDown16: 'IconCircleChevronDown16',
  IconChevronCircleDown24: 'IconCircleChevronDown24',
  IconChevronCircleLeft16: 'IconCircleChevronLeft16',
  IconChevronCircleLeft24: 'IconCircleChevronLeft24',
  IconChevronCircleRight16: 'IconCircleChevronRight16',
  IconChevronCircleRight24: 'IconCircleChevronRight24',
  IconChevronCircleUp16: 'IconCircleChevronUp16',
  IconChevronCircleUp24: 'IconCircleChevronUp24',
  IconCompress16: 'IconChevronsCompress16',
  IconCompress24: 'IconChevronsCompress24',
  IconEllipsisHorizontalCircleO16: 'IconCircleEllipsisHorizontalO16',
  IconEllipsisHorizontalCircleO24: 'IconCircleEllipsisHorizontalO24',
  IconExclamationCircle16: 'IconCircleExclamation16',
  IconExclamationCircle24: 'IconCircleExclamation24',
  IconExclamationTriangle16: 'IconTriangleExclamation16',
  IconExclamationTriangle24: 'IconTriangleExclamation24',
  IconInfoCircle16: 'IconCircleInfo16',
  IconInfoCircle24: 'IconCircleInfo24',
  IconIp4Rectangle16: 'IconRectangleIp416',
  IconIp4Rectangle24: 'IconRectangleIp424',
  IconIp6Rectangle16: 'IconRectangleIp616',
  IconIp6Rectangle24: 'IconRectangleIp624',
  IconLocationArrowCircleO16: 'IconCircleLocationArrowO16',
  IconLocationArrowCircleO24: 'IconCircleLocationArrowO24',
  IconMinusCircle16: 'IconCircleMinus16',
  IconMinusCircle24: 'IconCircleMinus24',
  IconMinusCircleO16: 'IconCircleMinusO16',
  IconMinusCircleO24: 'IconCircleMinusO24',
  IconMinusCircleS16: 'IconCircleMinusS16',
  IconMinusCircleS24: 'IconCircleMinusS24',
  IconMinusOctagon16: 'IconOctagonMinus16',
  IconMinusOctagon24: 'IconOctagonMinus24',
  IconMinusSquare16: 'IconSquareMinus16',
  IconMinusSquare24: 'IconSquareMinus24',
  IconPauseCircle16: 'IconCirclePause16',
  IconPauseCircle24: 'IconCirclePause24',
  IconPlayCircle16: 'IconCirclePlay16',
  IconPlayCircle24: 'IconCirclePlay24',
  IconPlusCircle16: 'IconCirclePlus16',
  IconPlusCircle24: 'IconCirclePlus24',
  IconPlusCircleS16: 'IconCirclePlusS16',
  IconPlusCircleS24: 'IconCirclePlusS24',
  IconPlusSquare16: 'IconSquarePlus16',
  IconPlusSquare24: 'IconSquarePlus24',
  IconQuestionCircle16: 'IconCircleQuestion16',
  IconQuestionCircle24: 'IconCircleQuestion24',
  IconStopCircle16: 'IconCircleStop16',
  IconStopCircle24: 'IconCircleStop24',
  IconTelegramCircle16: 'IconCircleTelegram16',
  IconTelegramCircle24: 'IconCircleTelegram24',
  IconUserArrowTriangleUp16: 'IconUserBadgeTriangleUp16',
  IconUserArrowTriangleUp24: 'IconUserBadgeTriangleUp24',
  IconWindowsArrowRotateLeft16: 'IconArrowRotateLeftBadgeWindows16',
  IconWrapText16: 'IconTextWrap16',
  IconWrapText24: 'IconTextWrap24',
  IconWrapTextSlash16: 'IconTextOverflow16',
  IconWrapTextSlash24: 'IconTextOverflow24',
  IconXmarkCircle16: 'IconCircleXmark16',
  IconXmarkCircle24: 'IconCircleXmark24',
};

const WRITE_MODE = process.argv.includes('--write');

async function run() {
  const monorepoRoot = path.resolve(__dirname, '../../..');

  const files = await fg(
    ['packages/**/*.{ts,tsx,js,jsx}', '!packages/icons/**'],
    {
      cwd: monorepoRoot,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/storybook-static/**',
        '**/coverage/**',
      ],
    }
  );

  // Step 1 — read and compute updates
  const updates = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.resolve(monorepoRoot, file);
      let updated = await fs.readFile(fullPath, 'utf8');
      let replacedInFile = 0;

      for (const [oldName, newName] of Object.entries(ALIASES)) {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        const matches = updated.match(regex);

        if (matches && matches.length > 0) {
          replacedInFile += matches.length;
          updated = updated.replace(regex, newName);
        }
      }

      return { file, fullPath, updated, replacedInFile };
    })
  );

  // Step 2 — log & write
  let totalFiles = 0;
  let totalReplaced = 0;

  await Promise.all(
    updates.map(async ({ file, fullPath, updated, replacedInFile }) => {
      if (replacedInFile > 0) {
        totalFiles += 1;
        totalReplaced += replacedInFile;

        console.log(
          `${WRITE_MODE ? '✏️  Update in' : '🔍 Found in'}: ${file} (${replacedInFile} changes)`
        );

        if (WRITE_MODE) {
          await fs.writeFile(fullPath, updated);
        }
      }
    })
  );

  console.log(`\n=== RESULT ===`);
  console.log(`Files affected: ${totalFiles}`);
  console.log(`Replacements: ${totalReplaced}`);
  console.log(`Mode: ${WRITE_MODE ? 'WRITE' : 'DRY-RUN'}`);
  console.log(`Run with --write to apply changes`);
}

run().catch(console.error);
