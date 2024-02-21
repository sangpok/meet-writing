import { Header } from '@Components/Header';
import { useHeader } from '@Components/Header/Header.hook';
import { useSidebar } from '@Components/Sidebar/Sidebar.hook';
import { Typography } from '@Components/Typography';
import { useUserSettings } from '@Hooks/useUserSettings';
import { changeRootFontSize } from '@Utils/index';
import cn from 'classnames';
import { useState } from 'react';
import styles from './SettingPage.module.scss';

const fontSizeMap = [
  {
    name: '작게',
    fontSize: '14px',
  },
  {
    name: '보통',
    fontSize: '16px',
  },
  {
    name: '크게',
    fontSize: '18px',
  },
];

const getFontSizeMapIndexByValue = (value: string) =>
  fontSizeMap.findIndex(({ fontSize }) => fontSize === value);

export const SettingPage = () => {
  const { get: getUserSettings, set: setUserSettings } = useUserSettings();
  const { openSidebar } = useSidebar();

  useHeader({
    path: '/settings',
    left: {
      type: 'iconButton',
      contents: 'menu',
    },
    center: {
      type: 'title',
      contents: '설정',
    },
  });

  const [selectedSizeId, setSelectedSizeId] = useState(
    getFontSizeMapIndexByValue(getUserSettings()?.baseFontSize || '16px')
  );

  const handleSelect = (index: number) => {
    setSelectedSizeId(index);
    changeRootFontSize(fontSizeMap[index].fontSize);
    setUserSettings({ baseFontSize: fontSizeMap[index].fontSize });
  };

  return (
    <>
      <Header onLeftClick={() => openSidebar()} />

      <div className={styles.body}>
        <div className={styles.group}>
          <Typography as="h6">글자 크기</Typography>
          <Typography as="body1">서비스 전체 글자 크기를 지정합니다.</Typography>

          <div className={styles.list}>
            {fontSizeMap.map(({ fontSize, name }, index) => (
              <button
                onClick={() => handleSelect(index)}
                style={{ fontSize }}
                className={cn({ [styles.selected]: index === selectedSizeId })}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <Typography as="h6">다크 모드</Typography>
          <Typography as="body1">추후 지원 예정입니다.</Typography>
        </div>

        <div className={styles.group}>
          <Typography as="h6">개발 정보</Typography>
          <Typography as="body1">김 주현(@sangpok) 1인 개발</Typography>
        </div>
      </div>
    </>
  );
};
