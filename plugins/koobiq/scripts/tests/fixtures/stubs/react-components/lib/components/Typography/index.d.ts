export declare const typographyPropVariant: readonly ["text-normal", "text-big", "headline", "title"];
export type TypographyPropVariant = (typeof typographyPropVariant)[number];
/**
 * @deprecated
 * This type has been deprecated, please use `TypographyPropDisplay` instead.
 */
export type TypographyDisplayVariant = 'block' | 'inline';
export type FormFieldLabelProps = { children?: import("react").ReactNode };
export declare const Typography: import("react").FC<{ variant?: TypographyPropVariant; as?: string }>;
