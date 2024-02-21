import styles from './Delimitor.module.scss';

export const Delimitor = ({ disabled = false }: { disabled?: boolean }) => {
  return <div className={styles.delimitor} aria-disabled={disabled} />;
};
