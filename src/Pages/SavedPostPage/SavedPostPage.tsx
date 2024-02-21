import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InfinitePostCardList } from '@Components/InfinitePostCardList';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { Typography } from '@Components/Typography';
import { useGetSavedPosts, useGetSavedPostsMetainfo } from '@Hooks/FirestoreHooks';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedPostPage.module.scss';
import { LoadingUI } from './SavedPostPage.skeleton';

export const SavedPostPage = () => {
  const navigate = useNavigate();
  const { openSidebar } = useSidebar();

  useHeader({
    path: '/saved-post',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'title',
      contents: '저장한 마중글',
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
          <SavedPostMetaInfo />
          <SavedPostList />
        </Suspense>
      </div>
    </div>
  );
};

const SavedPostMetaInfo = () => {
  const { data } = useGetSavedPostsMetainfo();

  const { savedPostsCount } = data;

  if (savedPostsCount === 0) {
    return <NoSavedPostView />;
  }

  return (
    <div>
      <p className={styles.metaInfo}>내 마음에 든 마중글이</p>
      <p className={styles.metaInfo}>
        <strong>총 {savedPostsCount}개</strong>가 있어요.
      </p>
    </div>
  );
};

const NoSavedPostView = () => {
  return (
    <div>
      <p className={styles.metaInfo}>
        <strong>아직 내 마음에 든 마중글이 없어요.</strong>
      </p>

      <Typography as="body2" className={styles.noPostDescription}>
        오른쪽 상단의 <strong>마중글 쓰기 버튼</strong>을 통해 마음에 든 문장을 수집해보거나, 메뉴의{' '}
        <strong>모두의 마중글</strong>을 둘러보며 마음에 드는 문장을 찾아보세요.
      </Typography>
    </div>
  );
};

const SavedPostList = () => {
  const getSavedPostsQuery = useGetSavedPosts();

  const hasNoList = getSavedPostsQuery.data.pages[0].list.length === 0;

  if (hasNoList) {
    return null;
  }

  return <InfinitePostCardList {...getSavedPostsQuery} type="savedPost" />;
};
