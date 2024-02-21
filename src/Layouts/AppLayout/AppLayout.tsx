import { Sidebar } from '@Components/Sidebar';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import styles from './AppLayout.module.scss';

export const AppLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
      <Sidebar />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
};
