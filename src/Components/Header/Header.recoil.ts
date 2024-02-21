import { IconName } from '@Icons/SVGIcon';
import { MouseEvent, ReactNode } from 'react';
import { atom } from 'recoil';

type HeaderBase = {
  disabled?: boolean;
  isSubmitButton?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type HeaderElement =
  | ({
      type: 'button';
      contents: ReactNode;
    } & HeaderBase)
  | ({
      type: 'textButton';
      contents: string;
    } & HeaderBase)
  | ({
      type: 'iconButton';
      contents: IconName;
    } & HeaderBase)
  | {
      type: 'title';
      contents: string;
      disabled?: never;
      onClick?: never;
      isSubmitButton?: never;
    }
  | ({
      type: 'component';
      contents: ReactNode;
    } & HeaderBase);

export type HeaderConfig = {
  path: string;
  initial?: boolean;
  left?: Partial<HeaderElement>;
  center?: Partial<HeaderElement>;
  right?: Partial<HeaderElement>;
  noAbsolute?: boolean;
  disabled?: boolean;
};

export const headerStore = atom<HeaderConfig>({
  key: 'headerStore',
  default: { path: '/', initial: true } as HeaderConfig,
});
