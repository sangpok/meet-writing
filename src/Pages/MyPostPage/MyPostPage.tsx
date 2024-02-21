import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InfinitePostCardList } from '@Components/InfinitePostCardList';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { Typography } from '@Components/Typography';
import { useGetMyPostMetadata, useGetMyPosts } from '@Hooks/FirestoreHooks';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPostPage.module.scss';
import { LoadingUI } from './MyPostPage.skeleton';

export const MyPostPage = () => {
  const navigate = useNavigate();
  const { openSidebar } = useSidebar();

  useHeader({
    path: '/mypost',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'title',
      contents: '내 마중글',
    },
    right: {
      type: 'iconButton',
      contents: 'pencil',
    },
  });

  return (
    <div className={styles.container}>
      <Header onLeftClick={() => openSidebar()} onRightClick={() => navigate('/post/write')} />

      <div className={styles.body}>
        <Suspense fallback={<LoadingUI />}>
          <MyPostMetaInfo />
          <MyPostList />
        </Suspense>
      </div>
    </div>
  );
};

const MyPostMetaInfo = () => {
  const { data } = useGetMyPostMetadata();

  const { postsCount, publicCount } = data;
  const hasNoPost = postsCount === 0;

  if (hasNoPost) {
    return <NoPostView />;
  }

  return (
    <div>
      <p className={styles.metaInfo}>
        내가 쓴 마중글은 모두 <strong>{postsCount}개</strong>이고,
      </p>
      <p className={styles.metaInfo}>
        그 중 <strong>{publicCount}개</strong>의 글이 공개됐어요.
      </p>
    </div>
  );
};

const NoPostView = () => {
  return (
    <div>
      <p className={styles.metaInfo}>
        <strong>아직 내가 쓴 마중글이 없어요.</strong>
      </p>

      <Typography as="body2" className={styles.noviewDescription}>
        오른쪽 상단의 <strong>마중글 쓰기 버튼</strong>을 통해 마음에 든 문장을 수집해보세요.
      </Typography>
    </div>
  );
};

const MyPostList = () => {
  const getMyPostQuerys = useGetMyPosts();
  const hasNoList = getMyPostQuerys.data.pages[0].list.length === 0;

  if (hasNoList) {
    return null;
  }

  return <InfinitePostCardList {...getMyPostQuerys} type="mypost" />;
};
