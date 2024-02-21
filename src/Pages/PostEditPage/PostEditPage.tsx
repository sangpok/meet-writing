import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { SelectBox } from '@Components/SelectBox';
import { auth } from '@Firebase/firebase';
import { useUpdatePost } from '@Hooks/FirestoreHooks';
import { Post } from '@Type/Model';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styles from './PostEditPage.module.scss';

type PostEditFormData = {
  id: string;
  author: string;
  source: string;
  visibility: string;
  content: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

export const PostEditPage = () => {
  const { state } = useLocation();

  const hasNoState = state === null;
  const isInvalidedAccess = hasNoState;

  if (isInvalidedAccess) {
    if (auth.currentUser !== null) {
      return <Navigate to="/mypost" />;
    }

    return <Navigate to="/" />;
  }

  const post = JSON.parse(state.post);

  return <PostEdit defaultPost={post} />;
};

const PostEdit = ({ defaultPost }: { defaultPost: Post }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { disableRight, disableHeader, changeRightContents } = useHeader({
    path: '/mypost/edit',
    left: {
      type: 'iconButton',
      contents: 'chevron-left',
    },
    center: {
      type: 'title',
      contents: '내 마중글 수정',
    },
    right: {
      type: 'textButton',
      contents: '수정',
      disabled: true,
      isSubmitButton: true,
    },
  });

  const [formData, setFormData] = useState<PostEditFormData>({
    ...defaultPost,
  });

  const [validations, setValidations] = useState<Validation<PostEditFormData>>({
    id: true,
    author: true,
    content: true,
    source: true,
    visibility: true,
  });

  const [selectedVisibility, setSelectedVisibility] = useState(
    defaultPost.visibility === 'public' ? 0 : 1
  );

  const updatePostMutation = useUpdatePost();

  useEffect(() => {
    const hasUnsavedChanges =
      formData.author !== defaultPost.author ||
      formData.content !== defaultPost.content ||
      formData.source !== defaultPost.source ||
      formData.visibility !== defaultPost.visibility;

    const couldSubmit = !Object.values(validations).includes(false) && hasUnsavedChanges;

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [formData]);

  const updateFields = (fields: Partial<PostEditFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...fields }));
  };

  const updateValidations = (fields: Partial<Validation<PostEditFormData>>) => {
    setValidations((prevData) => ({ ...prevData, ...fields }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableHeader();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    updatePostMutation.mutate(formData, {
      onSuccess() {
        navigate(`/mypost`);
      },
      onError(error) {
        console.log(error);
        alert('헐 ㄷㄷ');

        disableHeader(false);
        changeRightContents('가입');
      },
    });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Header onLeftClick={() => navigate('/mypost')} />

      <fieldset className={styles.body} disabled={updatePostMutation.isPending}>
        <div className={styles.postMeta}>
          <div className={styles.group}>
            <InputBox
              inline
              id="author"
              placeholder="누군가"
              maxLength={20}
              enterKeyHint="next"
              defaultValue={defaultPost.author}
              onChange={(e) => {
                updateFields({ author: e.target.value });
                updateValidations({ author: e.target.value !== null });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (document.querySelector('#source')! as HTMLInputElement).focus();
                }
              }}
            />
            <span>(이)가 쓴</span>
          </div>
          <div className={styles.group}>
            <InputBox
              inline
              id="source"
              placeholder="어딘가"
              maxLength={20}
              enterKeyHint="next"
              defaultValue={defaultPost.source}
              onChange={(e) => {
                updateFields({ source: e.target.value });
                updateValidations({ source: e.target.value !== null });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (document.querySelector('#selectTrigger')! as HTMLInputElement).focus();
                  (document.querySelector('#selectTrigger')! as HTMLInputElement).click();
                }
              }}
            />
            <span>에서 마주쳤어요.</span>
          </div>
          <div className={styles.group}>
            <span>이 글을</span>
            <SelectBox
              selectedId={selectedVisibility}
              onSelect={(selectedId) => {
                setSelectedVisibility(selectedId);
                updateFields({ visibility: selectedId === 0 ? 'public' : 'private' });
              }}
              disabled={updatePostMutation.isPending}
            />
            <span>할게요.</span>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <textarea
            ref={inputRef}
            placeholder="어떤 문장에 마음을 주셨나요?"
            inputMode="text"
            rows={15}
            tabIndex={0}
            defaultValue={defaultPost.content}
            onChange={(e) => {
              updateFields({ content: e.target.value });
              updateValidations({ content: e.target.value !== null });
            }}
          />
        </div>
      </fieldset>
    </form>
  );
};
