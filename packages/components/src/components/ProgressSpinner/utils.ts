import type { ProgressSpinnerPropSize } from './index';

const sizeMap: Record<ProgressSpinnerPropSize, number> = {
  compact: 16,
  big: 48,
};

const strokeWidthMap: Record<ProgressSpinnerPropSize, number> = {
  compact: 2,
  big: 3,
};

export function getSvgParamsBySize(
  size: ProgressSpinnerPropSize
): [number, number, number, number] {
  const sizeOfPixels = sizeMap[size];
  const strokeWidth = strokeWidthMap[size];
  const radius = (sizeOfPixels - strokeWidth) / 2;
  const strokeDasharray = radius * 2 * Math.PI;

  return [sizeOfPixels, strokeWidth, radius, strokeDasharray];
}
