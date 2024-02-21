import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { Typography } from '@Components/Typography';
import { auth } from '@Firebase/firebase';
import { useResignService } from '@Hooks/FirestoreHooks';
import { signOut } from 'firebase/auth';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './MyInfoPage.module.scss';

export const MyInfoPage = () => {
  const navigate = useNavigate();
  const { openSidebar } = useSidebar();

  useHeader({
    path: '/mypage',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'title',
      contents: '내 정보',
    },
    right: {
      type: 'iconButton',
      contents: 'pencil_line',
    },
  });

  const { mutate: resignService, isPending } = useResignService();

  const handleLogout = () => {
    const wouldLogout = confirm('마중글 서비스에서 로그아웃하시겠습니까?');

    if (wouldLogout) {
      signOut(auth);
      navigate('/');
    }
  };

  const handleResign = () => {
    const wouldResign = confirm(
      '마중글 서비스에서 탈퇴하시겠습니까?\n* 남기신 글은 삭제되지 않아요.'
    );

    if (wouldResign) {
      resignService(undefined, {
        onSuccess() {
          navigate('/resigned', { state: { resigned: true }, replace: true });
        },
      });
    }
  };

  return (
    <fieldset className={styles.container} disabled={isPending}>
      <Header onLeftClick={() => openSidebar()} onRightClick={() => navigate('/mypage/edit')} />

      <div className={styles.body}>
        <div className={styles.group}>
          <Typography as="h6">별명</Typography>
          <Typography as="body1">{auth.currentUser?.displayName}</Typography>
        </div>

        <div className={styles.group}>
          <Typography as="h6">이메일</Typography>
          <Typography as="body1">{auth.currentUser?.email}</Typography>
        </div>

        <div className={styles.group}>
          <Typography as="h6">로그아웃</Typography>
          <button className={styles.linkButton} onClick={handleLogout}>
            <Typography
              as="body1"
              className={styles.fontBold}
            >{`> 마중글 서비스에서 로그아웃하기`}</Typography>
          </button>
        </div>

        <div className={styles.group}>
          <div className={styles.submitField}>
            <Typography as="h6">탈퇴하기</Typography>
            {isPending && <RotatingLines width="1.125rem" strokeColor="#999" />}
          </div>
          <button className={styles.linkButton} onClick={handleResign}>
            <Typography
              as="body1"
              className={styles.fontBold}
            >{`> 마중글 서비스에서 탈퇴하기`}</Typography>
          </button>
        </div>
      </div>
    </fieldset>
  );
};
