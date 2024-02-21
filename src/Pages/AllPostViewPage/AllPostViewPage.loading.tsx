import { Delimitor } from '@Components/Delimitor';
import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { ToggleSaveButton } from '@Components/ToggleSaveButton';
import { Typography } from '@Components/Typography';
import { RotatingLines } from 'react-loader-spinner';
import styles from './AllPostViewPage.module.scss';

export const LoadingUI = () => {
  useHeader({
    path: '/post/all/loading',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'component',
      contents: <Delimitor disabled={true} />,
    },
    right: {
      type: 'button',
      contents: <ToggleSaveButton />,
    },
    disabled: true,
    noAbsolute: true,
  });

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.fallback}>
        <RotatingLines width="2rem" strokeColor="#979797" />
        <Typography as="body1">마중글을 불러오는 중입니다</Typography>
      </div>
    </div>
  );
};
