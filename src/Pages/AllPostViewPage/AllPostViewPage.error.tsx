import { Header } from '@Components/Header';
import { FallbackProps } from 'react-error-boundary';
import styles from './AllPostViewPage.module.scss';
import { FirestoreError, FirestoreErrorCode } from 'firebase/firestore';
import { LinkText } from '@Components/LinkText';
import { Typography } from '@Components/Typography';

const errorMessageMap: Partial<Record<FirestoreErrorCode, string>> = {
  'permission-denied': '권한이 없습니다.',
};

const getErrorMessageByCode = (code: FirestoreErrorCode) => errorMessageMap[code];

export const PageErrorUI = ({
  error,
  resetErrorBoundary,
}: Omit<FallbackProps, 'error'> & { error: FirestoreError }) => {
  const errorMessage = getErrorMessageByCode(error.code);

  if (errorMessage === undefined) {
    return (
      <div className={styles.body}>
        <Header />

        <div className={styles.fallback}>
          <Typography as="h6">어라라..😇</Typography>
          <Typography as="body1">개발자가 예상하지 못한 오류를 찾아내셨어요...</Typography>
          <Typography as="body2" className={styles.undefinedError}>
            {`오류 내용\n${error.message}`}
          </Typography>
          <Typography as="body1">아래의 버튼을 통해 다시 시도해주시겠어요?</Typography>
          <LinkText onClick={() => resetErrorBoundary()}>다시 시도하기</LinkText>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.fallback}>
        <Typography as="h6">어라라..😇</Typography>
        <Typography as="body1">{errorMessage}</Typography>
        <LinkText onClick={() => resetErrorBoundary()}>다시 시도하기</LinkText>
      </div>
    </div>
  );
};
