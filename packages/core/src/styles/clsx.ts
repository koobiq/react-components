type ClassName = string | false | null | undefined;

export function clsx(...classNames: ClassName[]) {
  return classNames.filter((className) => Boolean(className)).join(' ');
}
