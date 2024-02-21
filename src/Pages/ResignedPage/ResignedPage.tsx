import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { auth } from '@Firebase/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styles from './ResignedPage.module.scss';

export const ResignedPage = () => {
  const location = useLocation();

  if (!location.state?.resigned) {
    return <Navigate to="/" replace />;
  }

  return <RedirectHandler />;
};

const RedirectHandler = () => {
  const navigate = useNavigate();

  useHeader({
    path: '/resigned',
    center: {
      type: 'title',
      contents: '탈퇴 완료',
    },
  });

  const [timeCount, setTimeCount] = useState(5);
  const timerId = useRef<unknown | null>(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setTimeCount((prev) => prev - 1);
    }, 1000);

    const deleteAuth = async () => {
      await signOut(auth);
      await auth.currentUser!.delete();
    };

    deleteAuth();

    return () => clearInterval(timerId.current as number);
  }, []);

  useEffect(() => {
    if (timeCount === 0) {
      clearInterval(timerId.current as number);
      navigate('/');
    }
  }, [timeCount]);

  return (
    <>
      <Header />
      <div className={styles.body}>
        <p
          style={{ textAlign: 'center' }}
        >{`회원님의 정보가 정상적으로 삭제되었습니다.\n마중글 서비스를 이용해주셔서 감사합니다.`}</p>

        <p style={{ textAlign: 'center' }}>
          * {timeCount < 1 ? 1 : timeCount}초 후 첫 화면으로 돌아갑니다.
        </p>
      </div>
    </>
  );
};
