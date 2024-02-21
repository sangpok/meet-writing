import { IconButton } from '@Components/IconButton';
import { Typography } from '@Components/Typography';
import cn from 'classnames';
import { MouseEvent } from 'react';
import { useHeader } from './Header.hook';
import styles from './Header.module.scss';
import { HeaderElement } from './Header.recoil';

type HeaderProps = {
  onLeftClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCenterClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRightClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header = ({ onCenterClick, onLeftClick, onRightClick }: HeaderProps) => {
  const { headerConfig } = useHeader();

  if (headerConfig.initial) {
    // Layout만 유지
    return <header className={styles.header} />;
  }

  const getTypedElement = ({
    type,
    contents,
    disabled,
    isSubmitButton,
    onClick,
  }: Partial<HeaderElement>) => {
    if (type === 'button' || type === 'textButton') {
      return (
        <button
          className={cn({ [styles.textButton]: type === 'textButton' })}
          onClick={onClick}
          disabled={disabled}
          type={isSubmitButton ? 'submit' : 'button'}
        >
          {contents}
        </button>
      );
    }

    if (type === 'iconButton') {
      return (
        <IconButton
          name={contents}
          onClick={onClick}
          disabled={disabled}
          type={isSubmitButton ? 'submit' : 'button'}
        />
      );
    }

    if (type === 'title') {
      return <Typography as="h6">{contents}</Typography>;
    }

    if (type === 'component') {
      return contents;
    }
  };

  const leftElement =
    headerConfig?.left &&
    getTypedElement({ ...headerConfig.left, onClick: onLeftClick } as Partial<HeaderElement>);

  const centerElement =
    headerConfig?.center &&
    getTypedElement({ ...headerConfig.center, onClick: onCenterClick } as Partial<HeaderElement>);

  const rightElement =
    headerConfig?.right &&
    getTypedElement({ ...headerConfig.right, onClick: onRightClick } as Partial<HeaderElement>);

  return (
    <fieldset className={styles.a} disabled={headerConfig.disabled}>
      <header className={cn(styles.header, { [styles.spaceBetween]: headerConfig.noAbsolute })}>
        <div
          className={cn(
            { [styles.group]: !headerConfig.noAbsolute },
            { [styles.leftGroup]: !headerConfig.noAbsolute }
          )}
        >
          {leftElement}
        </div>

        {centerElement}

        <div
          className={cn(
            { [styles.group]: !headerConfig.noAbsolute },
            { [styles.rightGroup]: !headerConfig.noAbsolute }
          )}
        >
          {rightElement}
        </div>
      </header>
    </fieldset>
  );
};
