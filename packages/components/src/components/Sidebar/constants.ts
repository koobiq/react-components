/**
 * Transition durations, in ms. Asymmetric on purpose: collapsing is snappier
 * than expanding. The CSS reads these through custom properties, so this stays
 * the single source of truth.
 */
export const TRANSITION_TIMEOUT = { enter: 200, exit: 100 } as const;
