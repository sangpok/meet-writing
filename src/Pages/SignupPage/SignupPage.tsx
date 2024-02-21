import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { StatusText } from '@Components/StatusText';
import { Typography } from '@Components/Typography';
import { useCheckEmail, useCreateUser } from '@Hooks/FirestoreHooks';
import { AuthErrorCodes } from 'firebase/auth';
import { FormEvent, useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.scss';

type SignupFormData = {
  email: string;
  password: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

export const SignupPage = () => {
  const navigate = useNavigate();

  const { disableRight, disableHeader, changeRightContents } = useHeader({
    path: '/signup',
    left: {
      type: 'iconButton',
      contents: 'chevron-left',
    },
    center: {
      type: 'title',
      contents: '회원가입',
    },
    right: {
      type: 'textButton',
      contents: '가입',
      disabled: true,
      isSubmitButton: true,
    },
  });

  const [formData, setFormData] = useState<SignupFormData>({ email: '', password: '' });
  const [validations, setValidations] = useState<Validation<SignupFormData>>({
    email: false,
    password: false,
  });

  useEffect(() => {
    const couldSubmit = !Object.values(validations).includes(false);

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [validations]);

  const [isEmailMutated, setIsEmailMutated] = useState(false);

  const createUserMutation = useCreateUser();
  const checkEmailMutation = useCheckEmail();

  const updateFields = (fields: Partial<SignupFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...fields }));
  };

  const updateValidations = (fields: Partial<Validation<SignupFormData>>) => {
    setValidations((prevData) => ({ ...prevData, ...fields }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableHeader();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    createUserMutation.mutate(formData, {
      onSuccess(data) {
        if (data) {
          navigate('/mypage/initial-edit');
        }
      },
      onError(error) {
        if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
          alert('약한 비밀번호');
        } else {
          alert(error.message);
        }

        disableHeader(false);
        changeRightContents('가입');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Header onLeftClick={() => navigate('/')} />

      <div className={styles.pagePadding}>
        <fieldset className={styles.fieldList} disabled={createUserMutation.isPending}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              <div className={styles.fetchField}>
                <Typography as="h6">이메일</Typography>
                {checkEmailMutation.isPending && (
                  <RotatingLines width="1.125rem" strokeColor="black" />
                )}
              </div>
              <Typography as="body2">사용하실 이메일을 입력해주세요.</Typography>
            </div>

            <div className={styles.fieldInput}>
              <InputBox
                type="email"
                id="email"
                name="email"
                placeholder="example@meetwriting.com"
                enterKeyHint="next"
                onChange={(e) => {
                  updateFields({ email: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (document.querySelector('#password')! as HTMLInputElement).focus();
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === '') {
                    return;
                  }

                  checkEmailMutation.mutate(
                    { email: e.target.value },
                    {
                      onSuccess(data) {
                        if (data) {
                          updateValidations({ email: true });
                        } else {
                          updateValidations({ email: false });
                        }
                      },
                      onSettled() {
                        setIsEmailMutated(true);
                      },
                    }
                  );
                }}
              />
              {isEmailMutated && (
                <StatusText status={checkEmailMutation.data ? 'success' : 'fail'}>
                  {checkEmailMutation.data
                    ? '사용할 수 있는 이메일이에요.'
                    : '이미 존재하는 이메일이에요.'}
                </StatusText>
              )}
              {checkEmailMutation.isError && <StatusText status="fail">서버 오류!</StatusText>}
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              <div className={styles.fetchField}>
                <Typography as="h6">비밀번호</Typography>
                {/* <RotatingLines width="1.125rem" strokeColor="black" /> */}
              </div>
              <Typography as="body2">비밀번호를 6글자 이상 입력해주세요.</Typography>
            </div>

            <div className={styles.fieldInput}>
              <InputBox
                id="password"
                name="password"
                type="password"
                placeholder="******"
                minLength={6}
                maxLength={20}
                onChange={(e) => {
                  const password = e.target.value;
                  updateFields({ password });

                  if (password.length >= 6) {
                    updateValidations({ password: true });
                  } else {
                    updateValidations({ password: false });
                  }
                }}
                onBlur={(e) => {
                  const password = e.target.value;
                  const passwordSize = password.length;

                  const isFilled = password !== '';
                  const isOverSize = passwordSize >= 6;

                  const couldValidate = isFilled && isOverSize;

                  updateValidations({ password: couldValidate });
                }}
              />
              {formData.password !== '' && !validations.password && (
                <StatusText status="fail">비밀번호는 6글자 이상이여야 해요.</StatusText>
              )}
              {formData.password !== '' && validations.password && (
                <StatusText status="success">사용할 수 있는 비밀번호예요.</StatusText>
              )}
            </div>
          </div>
        </fieldset>
      </div>
    </form>
  );
};
