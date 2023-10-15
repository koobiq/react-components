import { clsx } from '@koobiq/react-core';

import s from './spacing.module.css';

export const spacingGap = [
  '0',
  'auto',
  '3xs',
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;

export type SpacingGap = (typeof spacingGap)[number];

export type SpacingProps = {
  /** margin */
  m?: SpacingGap;
  /** margin-block */
  mb?: SpacingGap;
  /** margin-inline */
  mi?: SpacingGap;
  /** margin-inline-start */
  mis?: SpacingGap;
  /** margin-block-end */
  mbe?: SpacingGap;
  /** margin-inline-end */
  mie?: SpacingGap;
  /** margin-block-start */
  mbs?: SpacingGap;
  /** padding */
  p?: SpacingGap;
  /** padding-block */
  pb?: SpacingGap;
  /** padding-inline */
  pi?: SpacingGap;
  /** padding-inline-start */
  pis?: SpacingGap;
  /** padding-block-end */
  pbe?: SpacingGap;
  /** padding-inline-end */
  pie?: SpacingGap;
  /** padding-block-start */
  pbs?: SpacingGap;
};

export const spacing = (props?: SpacingProps): string => {
  const { m, mb, mi, mis, mbe, mie, mbs, p, pb, pi, pis, pbe, pie, pbs } =
    props || {};

  const mbsVal = mbs || mb || m;
  const mieVal = mie || mi || m;
  const mbeVal = mbe || mb || m;
  const misVal = mis || mi || m;
  const pbsVal = pbs || pb || p;
  const pieVal = pie || pi || p;
  const pbeVal = pbe || pb || p;
  const pisVal = pis || pi || p;

  return clsx(
    mbsVal && s[`mbs_${mbsVal}`],
    mieVal && s[`mie_${mieVal}`],
    mbeVal && s[`mbe_${mbeVal}`],
    misVal && s[`mis_${misVal}`],
    pbsVal && s[`pbs_${pbsVal}`],
    pieVal && s[`pie_${pieVal}`],
    pbeVal && s[`pbe_${pbeVal}`],
    pisVal && s[`pis_${pisVal}`]
  );
};
