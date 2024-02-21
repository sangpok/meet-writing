import { Typography } from '@Components/Typography';
import { SVGIcon } from '@Icons/SVGIcon';
import cn from 'classnames';
import { PropsWithChildren } from 'react';
import styles from './StatusText.module.scss';

type StatusType = 'fail' | 'success' | 'warning';
export const StatusText = ({ status, children }: PropsWithChildren<{ status: StatusType }>) => {
  const isFail = status === 'fail';
  const isSuccess = status === 'success';
  const isWarning = status === 'warning';

  const iconName =
    (isFail && 'alert') || (isSuccess && 'info') || (isWarning && 'warning') || 'alert';

  return (
    <div
      className={cn(styles.container, {
        [styles.alert]: isFail,
        [styles.success]: isSuccess,
        [styles.warning]: isWarning,
      })}
    >
      <SVGIcon name={iconName} className={styles.size18} />
      <Typography as="body1">{children}</Typography>
    </div>
  );
};
