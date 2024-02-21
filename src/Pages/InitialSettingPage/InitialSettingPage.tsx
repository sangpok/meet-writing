import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { StatusText } from '@Components/StatusText';
import { Typography } from '@Components/Typography';
import { useCheckUsername, useUpdateUsername } from '@Hooks/FirestoreHooks';
import { getRandomNickname } from '@Utils/index';
import { FormEvent, useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './InitialSettingPage.module.scss';

type MyInfoFromData = {
  username: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

const defaultUsername = getRandomNickname();

export const InitialSettingPage = () => {
  const { disableRight, changeRightContents } = useHeader({
    path: '/mypage/initial-edit',
    center: {
      type: 'title',
      contents: '내 정보 입력',
    },
    right: {
      type: 'textButton',
      contents: '완료',
      isSubmitButton: true,
    },
  });

  const navigate = useNavigate();

  const updateUsernameMutation = useUpdateUsername();
  const checkUsernameMutation = useCheckUsername();

  const [formData, setFormData] = useState<MyInfoFromData>({ username: defaultUsername });
  const [validations, setValidations] = useState<Validation<MyInfoFromData>>({
    username: false,
  });

  useEffect(() => {
    const couldSubmit = !Object.values(validations).includes(false);

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [validations]);

  useEffect(() => {
    checkUsernameMutation.mutate(
      { username: defaultUsername },
      {
        onSuccess(data) {
          if (data) {
            updateValidations({ username: true });
          } else {
            updateValidations({ username: false });
          }
        },
        onSettled() {
          setIsMutated(true);
        },
      }
    );
  }, []);

  const [isMutated, setIsMutated] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableRight();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    updateUsernameMutation.mutate(formData, {
      onSuccess(data) {
        if (data) {
          navigate('/post/all');
        }
      },
      onError(error) {
        alert(error.message);
        disableRight(false);
        changeRightContents('완료');
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
      <Header />

      <div className={styles.pagePadding}>
        <div className={styles.fieldList}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              <div className={styles.fetchField}>
                <Typography as="h6">별명</Typography>
                {checkUsernameMutation.isPending && (
                  <RotatingLines width="1.125rem" strokeColor="black" />
                )}
              </div>
              <Typography as="body2">사용하실 별명을 입력해주세요.</Typography>
            </div>

            <div className={styles.fieldInput}>
              <InputBox
                type="text"
                id="username"
                name="username"
                defaultValue={defaultUsername}
                enterKeyHint="next"
                onChange={(e) => {
                  updateFields({ username: e.target.value });
                }}
                onBlur={(e) => {
                  const username = e.target.value;
                  const isEmpty = username === '';

                  if (isEmpty) {
                    return;
                  }

                  checkUsernameMutation.mutate(
                    { username: e.target.value },
                    {
                      onSuccess(data) {
                        if (data) {
                          updateValidations({ username: true });
                        } else {
                          updateValidations({ username: false });
                        }
                      },
                      onSettled() {
                        setIsMutated(true);
                      },
                    }
                  );
                }}
              />
              {isMutated && (
                <StatusText status={checkUsernameMutation.data ? 'success' : 'fail'}>
                  {checkUsernameMutation.data
                    ? '사용할 수 있는 별명이에요.'
                    : '이미 존재하는 별명이에요.'}
                </StatusText>
              )}
              {checkUsernameMutation.isError && <StatusText status="fail">서버 오류!</StatusText>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
