import type { CSSProperties, ReactNode } from 'react';

type SharedProps = {
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
  disabled: boolean;
  focusVisible: boolean;
};

export type LinkBaseProps = {
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
};
