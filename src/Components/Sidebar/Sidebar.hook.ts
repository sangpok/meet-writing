import { Draft, produce } from 'immer';
import { useRecoilState } from 'recoil';
import { SidebarProps, SidebarState, sidebarStore } from './Sidebar.recoil';

export const useSidebar = () => {
  const [sidebarState, setSidebarState] = useRecoilState(sidebarStore);

  const updateSidebarState = (updateFn: (draft: Draft<SidebarState>) => void) => {
    setSidebarState((prevState) => produce(prevState, updateFn));
  };

  const openSidebar = (props?: SidebarProps) => {
    updateSidebarState((draft) => {
      draft.isOpened = true;
      draft.props = props;
      return draft;
    });
  };

  const closeSidebar = () => {
    updateSidebarState((draft) => {
      draft.isOpened = false;
      return draft;
    });
  };

  return { sidebarState, openSidebar, closeSidebar };
};
