import logo from '@Assets/logo.svg';
import { IconButton } from '@Components/IconButton';
import { Typography } from '@Components/Typography';
import { auth } from '@Firebase/firebase';
import { IconName, SVGIcon } from '@Icons/SVGIcon';
import cn from 'classnames';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from './Sidebar.hook';
import styles from './Sidebar.module.scss';

type SidebarMenu = {
  path: string;
  icon: IconName;
  name: string;
};

const sidebarMenus: SidebarMenu[] = [
  {
    path: '/post/write',
    icon: 'pencil_line',
    name: '마중글 쓰기',
  },
  {
    path: '/post/all',
    icon: 'book',
    name: '모두의 마중글',
  },
  {
    path: '/mypost',
    icon: 'open-book-text',
    name: '내 마중글',
  },
  {
    path: '/saved-post',
    icon: 'book-marked',
    name: '저장한 마중글',
  },
  {
    path: '/mypage',
    icon: 'circle-user',
    name: '내 정보',
  },
  {
    path: '/settings',
    icon: 'settings',
    name: '설정',
  },
  {
    path: '/logout',
    icon: 'settings',
    name: '로그아웃(테스트용)',
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const { sidebarState, closeSidebar } = useSidebar();
  const { isOpened, props } = sidebarState;

  useEffect(() => {
    document.body.style.touchAction = isOpened ? 'none' : 'auto';
    document.body.style.overflow = isOpened ? 'hidden' : 'auto';
  }, [isOpened]);

  return (
    isOpened &&
    createPortal(
      <div className={styles.fullContainer}>
        <div className={styles.overlay} onClick={() => closeSidebar()} />
        <aside className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.controlHead}>
            <Typography as="h5">메뉴</Typography>
            <IconButton name="x" onClick={() => closeSidebar()} />
          </div>

          <ul className={styles.menuList}>
            {sidebarMenus.map(({ icon, name, path }) => (
              <li key={path}>
                <NavLink
                  to={path === '/logout' ? '' : path}
                  className={({ isActive }) => cn(styles.menuItem, { [styles.active]: isActive })}
                  state={{
                    prevUrl: location.pathname,
                  }}
                  tabIndex={0}
                  onClick={(e) => {
                    if (props?.hasUnsavedChanges) {
                      alert('음');
                      e.preventDefault();
                    }
                    if (path === '/logout') {
                      signOut(auth);
                    }
                    closeSidebar();
                  }}
                >
                  <SVGIcon name={icon} className={styles.size18} />
                  <span className={styles.name}>{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.logoWrapper}>
            <img src={logo} className={styles.logo} />
            <Typography as="h5">마중글</Typography>
          </div>
        </aside>
      </div>,
      document.querySelector('div#root')!
    )
  );
};
