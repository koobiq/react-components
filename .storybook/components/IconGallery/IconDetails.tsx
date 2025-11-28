import type { FC } from 'react';
import { useEffect, useRef } from 'react';

import {
  Badge,
  Button,
  FlexBox,
  Modal,
  Typography,
} from '@koobiq/react-components';
import { useBoolean, useCopyToClipboard } from '@koobiq/react-core';
import type { IconsManifest } from '@koobiq/react-icons';
import { IconCheck16, IconFileMultipleO16 } from '@koobiq/react-icons';
import * as icons from '@koobiq/react-icons';
import { Button as ButtonPrimitive } from '@koobiq/react-primitives';

import s from './IconGallery.module.css';

export type IconDetailsProps = IconsManifest['icons'][0];

export const IconDetails: FC<IconDetailsProps> = ({
  name,
  keywords,
  description,
  size,
}) => {
  const [, copy] = useCopyToClipboard();
  const [isCopied, { on, off }] = useBoolean(false);

  const Icon = icons[name];

  const hideCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHideCopied = () => {
    if (hideCopiedTimer.current) {
      clearTimeout(hideCopiedTimer.current);
    }

    hideCopiedTimer.current = setTimeout(() => {
      off();
      hideCopiedTimer.current = null;
    }, 3000);
  };

  useEffect(
    () => () => {
      if (hideCopiedTimer.current) {
        clearTimeout(hideCopiedTimer.current);
        hideCopiedTimer.current = null;
      }
    },
    []
  );

  return (
    <Modal
      key={name}
      size="small"
      control={(props) => (
        <ButtonPrimitive {...props} className={s['grid-item']}>
          <Icon />
          <Typography
            align="center"
            variant="text-compact"
            className={s['icon-name']}
            ellipsis
          >
            {name}
          </Typography>
        </ButtonPrimitive>
      )}
    >
      <Modal.Header>{name}</Modal.Header>
      <div className={s.previewArea}>
        <Icon />
      </div>
      <Modal.Body className={s.body}>
        <FlexBox direction="column" gap="xxs">
          <Typography color="contrast-secondary">Size</Typography>
          <Typography>{`${size}px`}</Typography>
        </FlexBox>
        {description && (
          <FlexBox direction="column" gap="xxs">
            <Typography color="contrast-secondary">Description</Typography>
            <Typography>{description}</Typography>
          </FlexBox>
        )}
        {!!keywords?.length && (
          <FlexBox direction="column" gap="xxs">
            <Typography color="contrast-secondary">Keywords</Typography>
            <FlexBox gap="xs" wrap="wrap">
              {keywords.map((tag) => (
                <Badge key={tag} variant="fade-theme">
                  {tag}
                </Badge>
              ))}
            </FlexBox>
          </FlexBox>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="fade-contrast-filled"
          onPress={async () => {
            const success = await copy(
              `import { ${name} } from '@koobiq/react-icons';`
            );

            if (success) {
              on();
              scheduleHideCopied();
            }
          }}
          endIcon={isCopied ? <IconCheck16 /> : <IconFileMultipleO16 />}
          fullWidth
        >
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
