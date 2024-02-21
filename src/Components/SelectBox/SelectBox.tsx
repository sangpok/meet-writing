import { SVGIcon } from '@Icons/SVGIcon';
import cn from 'classnames';
import { useState } from 'react';
import styles from './SelectBox.module.scss';

type SelectBoxProp = {
  selectedId: number;
  onSelect: (selectedId: number) => void;
  disabled?: boolean;
};
export const SelectBox = ({ selectedId = 0, onSelect, disabled = false }: SelectBoxProp) => {
  const [isBoxOpened, setIsBoxOpened] = useState(false);

  return (
    <>
      <div
        id="selectTrigger"
        className={styles.trigger}
        aria-disabled={disabled}
        tabIndex={0}
        onClick={() => setIsBoxOpened(!isBoxOpened)}
      >
        <span>{selectedId === 0 ? '공개' : '비공개'}</span>
        <SVGIcon
          name="chevron-down"
          className={cn(styles.size18, styles.rotateAnimation, { [styles.rotated]: isBoxOpened })}
        />

        {isBoxOpened && (
          <div id="optionbox" className={styles.optionBox} onClick={(e) => e.stopPropagation()}>
            <ul>
              <li
                className={cn({ [styles.selected]: selectedId === 0 })}
                tabIndex={0}
                onClick={() => {
                  onSelect(0);
                  setIsBoxOpened(false);
                }}
              >
                <SVGIcon name="unlock-keyhole" className={styles.size18} /> 공개
              </li>
              <li
                className={cn({ [styles.selected]: selectedId === 1 })}
                tabIndex={0}
                onClick={() => {
                  onSelect(1);
                  setIsBoxOpened(false);
                }}
              >
                <SVGIcon name="lock-keyhole" className={styles.size18} />
                비공개
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
