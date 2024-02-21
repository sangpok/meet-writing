import { Delimitor } from '@Components/Delimitor';
import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InfinitePostList } from '@Components/InfinitePostList';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { ToggleSaveButton } from '@Components/ToggleSaveButton';
import { useGetRandomPosts, useToggleSavedPost } from '@Hooks/FirestoreHooks';
import { Post } from '@Type/Model';
import { Suspense, useEffect, useState } from 'react';
import { LoadingUI } from './AllPostViewPage.loading';

import styles from './AllPostViewPage.module.scss';

export const AllPostViewPage = () => {
  return (
    <Suspense fallback={<LoadingUI />}>
      <AwaitedPostView />
    </Suspense>
  );
};

export const AwaitedPostView = () => {
  const { openSidebar } = useSidebar();

  const getRandomPostsQuery = useGetRandomPosts();

  const { mutate: toggleSavedPost } = useToggleSavedPost();

  const [currentPost, setCurrentPost] = useState(getRandomPostsQuery.data.pages[0].list[0]);

  const { changeRightContents } = useHeader({
    path: '/post/all',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'component',
      contents: <Delimitor />,
    },
    right: {
      type: 'button',
      contents: <ToggleSaveButton />,
      isSubmitButton: true,
    },
    disabled: false,
    noAbsolute: true,
  });

  useEffect(() => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    document.title = `${appTitle}: ${currentPost.author}의 ${currentPost.source}`;

    const { postId, isSavedPost } = currentPost;

    changeRightContents(<ToggleSaveButton postId={postId} isSavedPost={isSavedPost} />);
  }, [currentPost]);

  const handleToggleSavedPost = () => {
    setCurrentPost((prevData) => ({ ...prevData, isSavedPost: !prevData!.isSavedPost } as Post));

    toggleSavedPost(
      { id: currentPost.id, isSavedPost: currentPost.isSavedPost },
      {
        onError(error) {
          alert('실패함 ㅜㅜ');
          console.log(error);

          setCurrentPost(
            (prevData) => ({ ...prevData, isSavedPost: !prevData!.isSavedPost } as Post)
          );
        },
      }
    );
  };

  return (
    <div className={styles.body}>
      <Header onLeftClick={() => openSidebar()} onRightClick={handleToggleSavedPost} />
      <InfinitePostList {...getRandomPostsQuery} onPostChange={setCurrentPost} />
    </div>
  );
};
