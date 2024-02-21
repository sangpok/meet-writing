import { atom } from 'recoil';

export type SidebarState = {
  props?: SidebarProps;
  isOpened: boolean;
};

export type SidebarProps = UnsavedChangeProp | null;

export type UnsavedChangeProp = {
  hasUnsavedChanges: boolean;
};

export const sidebarStore = atom<SidebarState>({
  key: 'sidebar',
  default: {
    props: null,
    isOpened: false,
  },
});
