import { PropsWithChildren } from 'react';
import styles from './LinkText.module.scss';

export const LinkText = ({ children, onClick }: PropsWithChildren<{ onClick: () => void }>) => {
  return (
    <button className={styles.link} onClick={onClick}>
      {'> '}
      {children}
    </button>
  );
};
