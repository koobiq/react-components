'use client';

import { useRef, useState } from 'react';

import { useCopyToClipboard } from '@koobiq/react-core';
import {
  IconArrowDownToLine16,
  IconArrowUpRightFromSquare16,
  IconFileMultipleO16,
  IconTextOverflow16,
  IconTextWrap16,
} from '@koobiq/react-icons';

import { Button } from '../../Button';
import { Tooltip } from '../../Tooltip';
import s from '../CodeBlock.module.css';
import type { CodeBlockFile } from '../types';

export type CodeBlockActionBarProps = {
  file: CodeBlockFile;
  fallbackFileName: string;
  canToggleSoftWrap: boolean;
  canDownload: boolean;
  canCopy: boolean;
  softWrap: boolean;
  onSoftWrapToggle: () => void;
  copyTooltip: string;
  copiedTooltip: string;
  downloadTooltip: string;
  softWrapOnTooltip: string;
  softWrapOffTooltip: string;
  openExternalSystemTooltip: string;
  onTooltipOpenChange: (isOpen: boolean) => void;
};

function download(file: CodeBlockFile, fallbackFileName: string): void {
  const blob = new Blob([file.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = file.filename || fallbackFileName;
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function CodeBlockActionBar(props: CodeBlockActionBarProps) {
  const {
    file,
    fallbackFileName,
    canToggleSoftWrap,
    canDownload,
    canCopy,
    softWrap,
    onSoftWrapToggle,
    copyTooltip,
    copiedTooltip,
    downloadTooltip,
    softWrapOnTooltip,
    softWrapOffTooltip,
    openExternalSystemTooltip,
    onTooltipOpenChange,
  } = props;

  const [, copy] = useCopyToClipboard();
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const copyRequestRef = useRef(0);
  const isCopied = copiedContent === file.content;

  const copyCode = (): void => {
    copyRequestRef.current += 1;

    const copyRequest = copyRequestRef.current;

    void copy(file.content).then((isSuccessful) => {
      if (copyRequest === copyRequestRef.current) {
        setCopiedContent(isSuccessful ? file.content : null);
      }
    });
  };

  const resetCopyTooltip = (isOpen: boolean): void => {
    if (!isOpen) {
      copyRequestRef.current += 1;
      setCopiedContent(null);
    }
  };

  const onCopyTooltipOpenChange = (isOpen: boolean): void => {
    resetCopyTooltip(isOpen);
    onTooltipOpenChange(isOpen);
  };

  return (
    <div className={s.actionbar} data-testid="code-block-actionbar">
      <div className={s.actionbarButtonStack}>
        {canToggleSoftWrap && (
          <Tooltip
            onOpenChange={onTooltipOpenChange}
            control={(tooltipProps) => (
              <Button
                {...tooltipProps}
                variant="contrast-transparent"
                onlyIcon
                startIcon={
                  softWrap ? <IconTextOverflow16 /> : <IconTextWrap16 />
                }
                aria-label={softWrap ? softWrapOffTooltip : softWrapOnTooltip}
                onPress={onSoftWrapToggle}
              />
            )}
          >
            {softWrap ? softWrapOffTooltip : softWrapOnTooltip}
          </Tooltip>
        )}

        {canDownload && (
          <Tooltip
            onOpenChange={onTooltipOpenChange}
            control={(tooltipProps) => (
              <Button
                {...tooltipProps}
                variant="contrast-transparent"
                onlyIcon
                startIcon={<IconArrowDownToLine16 />}
                aria-label={downloadTooltip}
                onPress={() => download(file, fallbackFileName)}
              />
            )}
          >
            {downloadTooltip}
          </Tooltip>
        )}

        {canCopy && (
          <Tooltip
            shouldCloseOnPress={false}
            onOpenChange={onCopyTooltipOpenChange}
            control={(tooltipProps) => (
              <Button
                {...tooltipProps}
                variant="contrast-transparent"
                onlyIcon
                startIcon={<IconFileMultipleO16 />}
                aria-label={copyTooltip}
                onPress={copyCode}
              />
            )}
          >
            {isCopied ? copiedTooltip : copyTooltip}
          </Tooltip>
        )}

        {file.link && (
          <Tooltip
            onOpenChange={onTooltipOpenChange}
            control={(tooltipProps) => (
              <Button
                {...tooltipProps}
                variant="contrast-transparent"
                onlyIcon
                startIcon={<IconArrowUpRightFromSquare16 />}
                aria-label={openExternalSystemTooltip}
                onPress={() =>
                  window.open(file.link, '_blank', 'noopener,noreferrer')
                }
              />
            )}
          >
            {openExternalSystemTooltip}
          </Tooltip>
        )}
      </div>
    </div>
  );
}
