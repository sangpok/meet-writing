/** React */
import { createElement, type HTMLAttributes, type PropsWithChildren } from 'react';

/** Style */
import styles from './Typography.module.scss';

/** Util */
import cn from 'classnames';

/** Type */
type TypographyAs =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

type TypographyProp = PropsWithChildren<
  {
    as: TypographyAs;
  } & HTMLAttributes<HTMLHeadElement>
>;

export const Typography = ({ as, children, className, ...rest }: TypographyProp) => {
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as)) {
    return createElement(as, { ...rest, className: cn(as, className) }, children);
  }

  return (
    <p className={cn(className, styles[as])} {...rest}>
      {children}
    </p>
  );
};
