# TypeScript with Koobiq

The DS exports a props type per component (`ButtonProps`, `InputProps`,
`SelectNextProps<T>`…), ref types (`InputRef`, `ModalRef`, `TableRef`,
`SelectNextRef`…), value arrays and unions (`buttonPropVariant` /
`ButtonPropVariant`) and shared types re-exported from React Aria (`Key`,
`Selection`, `SortDescriptor`, `PressEvent`, `DateValue`, `TimeValue`,
`Locale`, `ListData`). Import them from `@koobiq/react-components`.

## Rules

**typescript/redeclared-values** — product code doesn't re-type Koobiq value
sets: use `ButtonPropVariant`, or derive a subset from the exported array ·
warning · agent.

```ts
// bad
type Variant = 'contrast-filled' | 'theme-transparent';
// good
import {
  buttonPropVariant,
  type ButtonPropVariant,
} from '@koobiq/react-components';
const toolbarVariants = [
  'contrast-filled',
  'theme-transparent',
] as const satisfies readonly ButtonPropVariant[];
```

**typescript/wrapper-props** — wrappers are typed with the Koobiq props
type and keep refs and rest props, so `data-testid`, `aria-*` and
`slotProps` still reach the component · warning · agent.

```tsx
import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@koobiq/react-components';

type SaveButtonProps = Omit<ButtonProps, 'variant' | 'ref'> & {
  dirty: boolean;
};

export const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ dirty, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      variant="contrast-filled"
      isDisabled={!dirty}
    />
  )
);
// polymorphic: ButtonProps<'a'>; compound roots: ComponentPropsWithRef<typeof Modal>
```

**typescript/suppressed-ds-types** — no `as any`, `@ts-ignore` or
`@ts-expect-error` around Koobiq usage; report the hidden problem too
(usually a deprecated or misnamed prop) · warning · agent.

**typescript/shared-types-source** — `Key`, `Selection`, `PressEvent`,
`DateValue`… come from `@koobiq/react-components`, not
`react-aria-components` / `@react-types/*` · info · agent.

**typescript/ref-types** — refs use the exported `XRef` types
(`useRef<InputRef>(null)`) · info · agent.

**typescript/collection-generics** — collections get typed items with an
`id` (`SelectNext<User>`, `items={users}`) · info · agent.

**typescript/polymorphic-cast** — let `as` infer element props; generic
wrappers keep the `as` generic instead of casting · info · agent.

**typescript/handler-types** — handlers use `PressEvent` and the value
types (`(value: string) => void`), not DOM event types · info · agent.
