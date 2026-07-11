'use client';

import type { FileItem } from '../../types';

export interface UseFileUploadItemReturn {
  /** Whether to show the progress indicator in place of the icon. */
  isLoading: boolean;
  /** Progress value in the range 0–100. */
  progress: number;
}

/**
 * Presentational helper deriving the display state for a single file item
 * (loading spinner vs. icon, and the progress value).
 */
export function useFileUploadItem(item: FileItem): UseFileUploadItemReturn {
  return {
    isLoading: !!item.loading,
    progress: item.progress ?? 0,
  };
}
