import type { DistributiveOmit } from './DistributiveOmit';

export type Merge<A, B> = Omit<A, keyof B> & B;
export type DistributiveMerge<A, B> = DistributiveOmit<A, keyof B> & B;
