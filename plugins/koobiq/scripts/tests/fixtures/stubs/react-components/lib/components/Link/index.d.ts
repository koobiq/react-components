type LinkDeprecatedProps = {
    /**
     * @deprecated
     * The "visitable" prop is deprecated. Use "isVisitable" prop to replace it.
     */
    visitable?: boolean;
};
export type LinkBaseProps = {
    allowVisited?: boolean;
    href?: string;
} & LinkDeprecatedProps;
export declare const Link: import("react").ForwardRefExoticComponent<LinkBaseProps>;
