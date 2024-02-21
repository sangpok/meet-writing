import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { InputBox } from '@Components/InputBox';
import { Typography } from '@Components/Typography';
import { useServiceLogin } from '@Hooks/FirestoreHooks';
import { validateEmail } from '@Utils/index';
import { ChangeEvent, FormEvent, InputHTMLAttributes, useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';

type LoginFormData = {
  email: string;
  password: string;
};

type Validation<T> = {
  [k in keyof T]: boolean;
};

const initialLoginFormData: LoginFormData = { email: '', password: '' };
const initialLoginValidation: Validation<LoginFormData> = { email: false, password: false };

export const LoginPage = () => {
  const navigate = useNavigate();
  const { disableRight, disableHeader, changeRightContents } = useHeader({
    path: '/login',
    left: {
      type: 'iconButton',
      contents: 'chevron-left',
    },
    center: {
      type: 'title',
      contents: '로그인',
    },
    right: {
      type: 'textButton',
      contents: '로그인',
      isSubmitButton: true,
      disabled: true,
    },
  });

  const { mutate: login, isPending } = useServiceLogin();

  const [formData, setFormData] = useState(initialLoginFormData);
  const [formDataValidation, setFormDataValidation] = useState(initialLoginValidation);

  useEffect(() => {
    const couldSubmit = !Object.values(formDataValidation).includes(false);

    if (couldSubmit) {
      disableRight(false);
    } else {
      disableRight();
    }
  }, [formDataValidation]);

  const updateFields = (fields: Partial<LoginFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...fields }));
  };

  const updateValidations = (fields: Partial<Validation<LoginFormData>>) => {
    setFormDataValidation((prevData) => ({ ...prevData, ...fields }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    disableHeader();
    changeRightContents(<RotatingLines width="2rem" strokeColor="black" />);

    login(formData, {
      onSuccess() {
        navigate('/post/all');
      },
      onError(error) {
        alert(error.message);

        disableHeader(false);
        changeRightContents('로그인');
      },
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFields({ [e.target.name]: e.target.value });

    if (e.target.name === 'email') {
      updateValidations({ email: validateEmail(e.target.value) });
    }

    if (e.target.name === 'password') {
      updateValidations({ password: e.target.value.length >= 6 });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isPending}>
        <Header onLeftClick={() => navigate('/')} />

        <div className={styles.body}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="이메일"
            description="가입하신 이메일을 입력해주세요."
            placeholder="example@meetwriting.com"
            minLength={6}
            onChange={handleChange}
          />

          <InputField
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            description="비밀번호를 입력해주세요."
            placeholder="최소 6글자 이상, 20글자 이하"
            minLength={6}
            maxLength={20}
            onChange={handleChange}
          />
        </div>
      </fieldset>
    </form>
  );
};

type InputFieldProp = {
  label: string;
  description: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({ label, description, ...inputProps }: InputFieldProp) => {
  return (
    <fieldset className={styles.fieldSection}>
      <div className={styles.labelSection}>
        <Typography as="h6">{label}</Typography>
        <Typography as="body2" className={styles.grayed}>
          {description}
        </Typography>
      </div>

      <InputBox {...inputProps} />
    </fieldset>
  );
};
