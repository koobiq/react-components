import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseCheckboxProps } from '../../behaviors';

type SharedProps = {
  hovered?: boolean;
  error?: boolean;
  pressed?: boolean;
  checked?: boolean;
  disabled?: boolean;
  focusVisible?: boolean;
  indeterminate?: boolean;
};

type DataAttributeKey = `data-${string}`;

export type CheckboxProps = ExtendableProps<
  {
    children?:
      | ReactNode
      | ((
          values: SharedProps & { defaultChildren: ReactNode | undefined }
        ) => ReactNode);
    className?:
      | string
      | ((
          values: SharedProps & { defaultClassName: string | undefined }
        ) => string);
    style?:
      | CSSProperties
      | ((
          values: SharedProps & { defaultStyle: CSSProperties }
        ) => CSSProperties | undefined);
    disabled?: boolean;
    labelProps?: ComponentProps<'label'> & {
      [dataAttribute: DataAttributeKey]: unknown;
    };
  },
  UseCheckboxProps
>;
