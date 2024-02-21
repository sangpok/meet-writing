import { Draft, produce } from 'immer';
import { ReactNode, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { HeaderConfig, headerStore } from './Header.recoil';

export const useHeader = (defaultConfig?: HeaderConfig) => {
  const [headerConfig, setHeaderConfig] = useRecoilState(headerStore);

  useEffect(() => {
    if (defaultConfig && defaultConfig.path !== headerConfig.path) {
      setHeaderConfig({ ...defaultConfig, initial: false });
    }
  }, [headerConfig, defaultConfig]);

  const updateHeaderConfig = (updateFn: (draft: Draft<HeaderConfig>) => void) => {
    setHeaderConfig((prevState) => produce(prevState, updateFn));
  };

  const disableHeader = (disabled: boolean = true) => {
    updateHeaderConfig((draft) => {
      draft.disabled = disabled;
      return draft;
    });
  };

  const disableLeft = (disabled: boolean = true) => {
    updateHeaderConfig((draft) => {
      draft.left!.disabled = disabled;
      return draft;
    });
  };

  const disableRight = (disabled: boolean = true) => {
    updateHeaderConfig((draft) => {
      draft.right!.disabled = disabled;
      return draft;
    });
  };

  const changeLeftContents = (contents: ReactNode) => {
    updateHeaderConfig((draft) => {
      draft.left!.contents = contents;
      return draft;
    });
  };

  const changeCenterContents = (contents: ReactNode) => {
    updateHeaderConfig((draft) => {
      draft.center!.contents = contents;
      return draft;
    });
  };

  const changeRightContents = (contents: ReactNode) => {
    updateHeaderConfig((draft) => {
      draft.right!.contents = contents;
      return draft;
    });
  };

  return {
    headerConfig,
    updateHeaderConfig,
    disableHeader,
    disableLeft,
    disableRight,
    changeLeftContents,
    changeCenterContents,
    changeRightContents,
  };
};
