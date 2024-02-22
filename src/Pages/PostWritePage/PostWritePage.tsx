import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { SelectBox } from '@Components/SelectBox';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { useCreatePost } from '@Hooks/FirestoreHooks';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './PostWritePage.module.scss';

type PostWriteFormData = {
  author: string;
  source: string;
  visibility: string;
  content: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

export const PostWritePage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { openSidebar } = useSidebar();
  const { disableRight, disableHeader, changeRightContents } = useHeader({
    path: '/post/write',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'title',
      contents: '마중글 쓰기',
    },
    right: {
      type: 'textButton',
      contents: '작성',
      disabled: true,
      isSubmitButton: true,
    },
  });

  const [formData, setFormData] = useState<PostWriteFormData>({
    author: '',
    content: '',
    source: '',
    visibility: 'public',
  });

  const [validations, setValidations] = useState<Validation<PostWriteFormData>>({
    author: false,
    content: false,
    source: false,
    visibility: true,
  });

  const [selectedVisibility, setSelectedVisibility] = useState(0);

  const createPostMutation = useCreatePost();

  useEffect(() => {
    // console.log('앗?');
  }, []);

  useEffect(() => {
    const couldSubmit = !Object.values(validations).includes(false);

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [validations]);

  const updateFields = (fields: Partial<PostWriteFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...fields }));
  };

  const updateValidations = (fields: Partial<Validation<PostWriteFormData>>) => {
    setValidations((prevData) => ({ ...prevData, ...fields }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableHeader();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    createPostMutation.mutate(formData, {
      onSuccess(data) {
        navigate(`/post/all?pid=${data.id}`);
      },
      onError(error) {
        console.log(error);
        alert('헐 ㄷㄷ');

        disableHeader(false);
        changeRightContents('가입');
      },
    });
  };

  const handleBackClick = () => {
    const hasUnsavedChanges =
      formData.author !== '' ||
      formData.content !== '' ||
      formData.source !== '' ||
      formData.visibility !== 'public';

    openSidebar({ hasUnsavedChanges });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Header onLeftClick={() => handleBackClick()} />

      <fieldset className={styles.body} disabled={createPostMutation.isPending}>
        <div className={styles.postMeta}>
          <div className={styles.group}>
            <InputBox
              inline
              id="author"
              placeholder="누군가"
              maxLength={20}
              enterKeyHint="next"
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
              disabled={createPostMutation.isPending}
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
            onChange={(e) => {
              updateFields({ content: e.target.value });
              updateValidations({ content: e.target.value !== null });
            }}
            tabIndex={0}
          />
        </div>
      </fieldset>
    </form>
  );
};
