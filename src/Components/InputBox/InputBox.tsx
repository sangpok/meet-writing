import { getTextWidth } from '@Utils/index';
import cn from 'classnames';
import { FormEvent, InputHTMLAttributes, useEffect, useRef } from 'react';
import styles from './InputBox.module.scss';

type InputBoxProp = {
  inline?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputBox = ({ inline, ...props }: InputBoxProp) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const minWidth = props?.defaultValue
      ? getTextWidth(props.defaultValue as string, inputRef.current)
      : getTextWidth(props.placeholder || '누군가', inputRef.current);

    inputRef.current.style.minWidth = minWidth + 'px';
    inputRef.current.style.width = minWidth + 'px';
  }, []);

  if (inline) {
    const { onInput, ...newProps } = props;

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
      const currentTarget = e.target as HTMLInputElement;
      const currentWidth = getTextWidth(currentTarget.value, currentTarget);

      currentTarget.style.width = currentWidth + 'px';

      onInput && onInput(e);
    };

    return (
      <input
        ref={inputRef}
        className={cn(styles.inputBox, styles.inline)}
        onInput={handleInput}
        {...newProps}
      />
    );
  }

  return <input className={styles.inputBox} {...props} />;
};
