import React, { useMemo, useRef } from 'react';
import ReactSelect, { components } from 'react-select';
import type { MenuProps, Props, GroupBase, ControlProps } from 'react-select';
import { Popover, type PopoverPropPlacement } from '@koobiq/react-components';
import { useMultiRef, useBoolean, useElementSize } from '@koobiq/react-core';

export type MyReactSelectProps<
  O,
  M extends boolean = false,
  G extends GroupBase<O> = GroupBase<O>,
> = Omit<Props<O, M, G>, 'menuPlacement'> & {
  menuPlacement?: PopoverPropPlacement;
};

export function MyReactSelect<
  O,
  M extends boolean = false,
  G extends GroupBase<O> = GroupBase<O>,
>(props: MyReactSelectProps<O, M, G>) {
  const {
    menuPlacement: menuPlacementProp = 'bottom start',
    styles: stylesProp,
    onMenuOpen: onMenuOpenProp,
    menuIsOpen: menuIsOpenProp,
    components: componentsProp,
    onMenuClose: onMenuCloseProp,
    menuPortalTarget: menuPortalTargetProp,
    ...other
  } = props;
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
        placement={menuPlacementProp}
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
      {...other}
      onMenuOpen={(...a) => {
        on();
        onMenuOpenProp?.(...a);
      }}
      onMenuClose={(...a) => {
        off();
        onMenuCloseProp?.(...a);
      }}
      menuIsOpen={menuIsOpenProp ?? open}
      menuPortalTarget={menuPortalTargetProp ?? null}
      components={{ Control, Menu, ...componentsProp }}
      styles={{
        ...stylesProp,
        menu: (base) => ({
          ...base,
          ...stylesProp?.menu,
          boxShadow: 'none',
          position: 'static',
          backgroundColor: 'transparent',
        }),
      }}
    />
  );
}
