import React, { useMemo, useRef } from 'react';
import ReactSelect, { components } from 'react-select';
import type { MenuProps, Props, GroupBase, ControlProps } from 'react-select';
import { Popover } from '@koobiq/react-components';
import { useMultiRef, useBoolean, useElementSize } from '@koobiq/react-core';

export type MyReactSelectProps<
  O,
  M extends boolean = false,
  G extends GroupBase<O> = GroupBase<O>,
> = Props<O, M, G>;

export function MyReactSelect<
  O,
  M extends boolean = false,
  G extends GroupBase<O> = GroupBase<O>,
>(props: MyReactSelectProps<O, M, G>) {
  const { ref, width } = useElementSize();
  const controlRef = useRef<HTMLDivElement | null>(null);

  const [open, { on, off }] = useBoolean(false);

  const Control = useMemo(
    () =>
      function Control(p: ControlProps<O, M, G>) {
        return (
          <components.Control
            {...p}
            innerRef={useMultiRef([controlRef, p.innerRef, ref])}
          />
        );
      },
    []
  );

  const Menu = (p: MenuProps<O, M, G>) => {
    return (
      <Popover
        offset={4}
        type="menu"
        size={width}
        isOpen={open}
        anchorRef={controlRef}
        placement="bottom start"
        hideCloseButton
        isNonModal
        hideArrow
      >
        <components.Menu {...p} />
      </Popover>
    );
  };

  return (
    <ReactSelect<O, M, G>
      {...props}
      onMenuOpen={(...a) => {
        on();
        props.onMenuOpen?.(...a);
      }}
      onMenuClose={(...a) => {
        off();
        props.onMenuClose?.(...a);
      }}
      menuIsOpen={open}
      menuPortalTarget={null}
      components={{ Control, Menu }}
      styles={{
        menu: (base) => ({
          ...base,
          position: 'static',
          backgroundColor: 'transparent',
        }),
      }}
    />
  );
}
