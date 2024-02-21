import { IconName, SVGIcon } from '@Icons/SVGIcon';
import cn from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.scss';

type IconButtonProp = {
  name?: IconName;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = ({ name, className, ...rest }: IconButtonProp) => {
  if (name === undefined) {
    throw new Error('IconButton에는 name Prop이 필요합니다');
  }

  return (
    <button className={cn(styles.button, className)} {...rest}>
      <SVGIcon name={name} />
    </button>
  );
};
