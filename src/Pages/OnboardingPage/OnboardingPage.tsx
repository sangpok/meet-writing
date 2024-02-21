import { auth } from '@/Firebase/firebase';
import logo from '@Assets/logo.svg';
import { LinkText } from '@Components/LinkText';
import { Typography } from '@Components/Typography';
import { Navigate, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import styles from './OnboardingPage.module.scss';

const onboardings = [
  {
    id: 0,
    title: '마음을 준 글, 마중글',
    contents: `마주친 문장에
마음을 준 적이 있지 않으신가요?

책을 읽다가
기사를 읽다가
누군가가 달아놓은 댓글을 보다가

마음에 드는 문장을
분명 마주친 적이 있으실 거예요.

마중글은 그런 문장을 간직할 수 있도록
도와드리고 있어요.`,
  },
  {
    id: 1,
    title: '내 마중글',
    contents: `본인이 쓴 마중글을 모아볼 수 있어요.

언제, 어디에서 마주친 문장인지
한눈에 알아볼 수 있어요.`,
  },
  {
    id: 2,
    title: '모두의 마중글',
    contents: `다른 사람이 쓴 마중글을 모아볼 수 있어요.

다른 사람들은
어떤 문장에 마음을 주었는지,
그들의 시선을 함께해보세요.`,
  },
  {
    id: 3,
    title: '시작하기',
    contents: `이제 마중글을 시작해볼까요?
아래의 방법으로 시작할 수 있어요.`,
  },
];

export async function loader() {
  await auth.authStateReady();
  return { isLoggined: auth.currentUser !== null };
}

export const OnboardingPage = () => {
  const { isLoggined } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const location = useLocation();
  const navigate = useNavigate();

  if (isLoggined && location.pathname === '/') {
    return <Navigate to="/post/all" />;
  }

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <img className={styles.logo} src={logo} />
        <Typography as="h3">마중글</Typography>
      </div>

      <main className={styles.scrollableBody}>
        {onboardings.map(({ title, contents }) => (
          <section key={title} className={styles.onboardingItem}>
            <Typography as="h5">| {title}</Typography>
            <Typography as="body1" className={styles.description}>
              {contents}
            </Typography>
            {title === '시작하기' && (
              <>
                <LinkText onClick={handleSignup}>계정 만들기</LinkText>
                <LinkText onClick={handleLogin}>로그인하기</LinkText>
              </>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};
