import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { StatusText } from '@Components/StatusText';
import { Typography } from '@Components/Typography';
import { auth } from '@Firebase/firebase';
import { useUpdateUsername } from '@Hooks/FirestoreHooks';
import { FormEvent, useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './MyInfoEditPage.module.scss';

type MyInfoFromData = {
  username: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

export const MyInfoEditPage = () => {
  const { disableRight, changeRightContents, disableHeader } = useHeader({
    path: '/mypage/initial-edit',
    left: {
      type: 'iconButton',
      contents: 'chevron-left',
    },
    center: {
      type: 'title',
      contents: '내 정보 수정',
    },
    right: {
      type: 'textButton',
      contents: '완료',
      isSubmitButton: true,
    },
  });

  const navigate = useNavigate();

  const updateUsernameMutation = useUpdateUsername();

  const [formData, setFormData] = useState<MyInfoFromData>({
    username: auth.currentUser!.displayName!,
  });

  const [validations, setValidations] = useState<Validation<MyInfoFromData>>({
    username: false,
  });

  const [isMutated, setIsMutated] = useState(false);

  useEffect(() => {
    const couldSubmit = !Object.values(validations).includes(false);

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [validations]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableHeader();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    updateUsernameMutation.mutate(formData, {
      onSuccess(data) {
        if (data) {
          navigate('/mypage');
        } else {
          changeRightContents('완료');
          setIsMutated(true);
          disableHeader(false);
        }
      },
      onError(error) {
        alert(error.message);
        disableHeader(false);
        changeRightContents('완료');
        setIsMutated(true);
      },
    });
  };

  const updateFields = (fields: Partial<MyInfoFromData>) => {
    setFormData((prevData) => ({ ...prevData, ...fields }));
  };

  const updateValidations = (fields: Partial<Validation<MyInfoFromData>>) => {
    setValidations((prevData) => ({ ...prevData, ...fields }));
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Header onLeftClick={() => navigate('/mypage')} />

      <div className={styles.pagePadding}>
        <div className={styles.fieldList}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              <div className={styles.fetchField}>
                <Typography as="h6">별명</Typography>
              </div>
              <Typography as="body2">사용하실 별명을 입력해주세요.</Typography>
            </div>

            <div className={styles.fieldInput}>
              <InputBox
                type="text"
                id="username"
                name="username"
                defaultValue={auth.currentUser!.displayName!}
                enterKeyHint="next"
                onChange={(e) => {
                  if (isMutated) {
                    setIsMutated(false);
                  }

                  const username = e.target.value.trim();
                  const isEmpty = username === '';
                  const isSamePrev = username === auth.currentUser!.displayName!;

                  if (isEmpty || isSamePrev) {
                    return updateValidations({ username: false });
                  }

                  updateValidations({ username: true });
                  updateFields({ username: e.target.value });
                }}
                disabled={updateUsernameMutation.isPending}
              />
              {isMutated && (
                <StatusText status={updateUsernameMutation.data ? 'success' : 'fail'}>
                  {updateUsernameMutation.data
                    ? '사용할 수 있는 별명이에요.'
                    : '이미 존재하는 별명이에요.'}
                </StatusText>
              )}
              {updateUsernameMutation.isError && <StatusText status="fail">서버 오류!</StatusText>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
