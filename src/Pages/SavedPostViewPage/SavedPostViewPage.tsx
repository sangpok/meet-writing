import { Delimitor } from '@Components/Delimitor/Delimitor';
import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InfinitePostList } from '@Components/InfinitePostList';
import { ToggleSaveButton } from '@Components/ToggleSaveButton';
import { useGetSavedPosts, useToggleSavedPost } from '@Hooks/FirestoreHooks';
import { Post } from '@Type/Model';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styles from './SavedPostViewPage.module.scss';

export const SavedPostViewPage = () => {
  const location = useLocation();

  if (location.state === null) {
    return <Navigate to="/mypost" replace={true} />;
  }

  const { post: initialPost } = JSON.parse(location.state);

  return (
    <Suspense fallback={'dlatl'}>
      <AwaitedPostView initialPost={initialPost} />
    </Suspense>
  );
};

const AwaitedPostView = ({ initialPost }: { initialPost: Post }) => {
  const navigate = useNavigate();

  const { changeRightContents } = useHeader();
  const savedPostsQuery = useGetSavedPosts();
  const { mutate: toggleSavedPost } = useToggleSavedPost();

  useHeader({
    path: '/saved-post/view',
    left: {
      type: 'iconButton',
      contents: 'chevron-left',
    },
    center: {
      type: 'component',
      contents: <Delimitor />,
    },
    right: {
      type: 'button',
      contents: (
        <ToggleSaveButton postId={initialPost.postId} isSavedPost={initialPost.isSavedPost} />
      ),
      isSubmitButton: true,
    },
    disabled: false,
    noAbsolute: true,
  });

  const [currentPost, setCurrentPost] = useState(initialPost);

  useEffect(() => {
    document
      .querySelector(`div[data-pid='${initialPost.id}']`)!
      .scrollIntoView({ behavior: 'instant' });
  }, []);

  useEffect(() => {
    console.log(currentPost);

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
      <Header onLeftClick={() => navigate('/saved-post')} onRightClick={handleToggleSavedPost} />
      <InfinitePostList {...savedPostsQuery} onPostChange={setCurrentPost} />
    </div>
  );
};
