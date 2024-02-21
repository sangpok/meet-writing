import styles from './MyPostPage.module.scss';

export const LoadingUI = () => {
  return (
    <>
      <div className={styles.skeletonMetaGroup} style={{ gap: '.5rem' }}>
        <div className={styles.skeletonItem} style={{ width: '70%', height: '1.5rem' }} />
        <div className={styles.skeletonItem} style={{ width: '65%', height: '1.5rem' }} />
      </div>

      <div className={styles.skeletonPostItem}>
        <div className={styles.skeletonItem} style={{ width: '3rem', height: '1.2rem' }} />
        <div
          className={styles.skeletionGroup}
          style={{ flex: 1, flexDirection: 'column', gap: '1.5rem' }}
        >
          <div className={styles.skeletionGroup} style={{ width: '100%' }}>
            <div
              className={styles.skeletionGroup}
              style={{ width: '100%', flexDirection: 'row', gap: '.75rem' }}
            >
              <div
                className={styles.skeletionGroup}
                style={{ width: '100%', flexDirection: 'column', gap: '.5rem' }}
              >
                <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
                <div className={styles.skeletonItem} style={{ width: '50%', height: '1rem' }} />
              </div>
              <div className={styles.skeletionGroup}>
                <div className={styles.skeletonItem} style={{ minWidth: '2rem', height: '2rem' }} />
              </div>
            </div>
          </div>
          <div
            className={styles.skeletionGroup}
            style={{ flexDirection: 'column', gap: '.25rem', width: '100%' }}
          >
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
          </div>
        </div>
      </div>
      <div className={styles.skeletonPostItem}>
        <div className={styles.skeletonItem} style={{ width: '3rem', height: '1.2rem' }} />
        <div
          className={styles.skeletionGroup}
          style={{ flex: 1, flexDirection: 'column', gap: '1.5rem' }}
        >
          <div className={styles.skeletionGroup} style={{ width: '100%' }}>
            <div
              className={styles.skeletionGroup}
              style={{ width: '100%', flexDirection: 'row', gap: '.75rem' }}
            >
              <div
                className={styles.skeletionGroup}
                style={{ width: '100%', flexDirection: 'column', gap: '.5rem' }}
              >
                <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
                <div className={styles.skeletonItem} style={{ width: '50%', height: '1rem' }} />
              </div>
              <div className={styles.skeletionGroup}>
                <div className={styles.skeletonItem} style={{ minWidth: '2rem', height: '2rem' }} />
              </div>
            </div>
          </div>
          <div
            className={styles.skeletionGroup}
            style={{ flexDirection: 'column', gap: '.25rem', width: '100%' }}
          >
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
          </div>
        </div>
      </div>
      <div className={styles.skeletonPostItem}>
        <div className={styles.skeletonItem} style={{ width: '3rem', height: '1.2rem' }} />
        <div
          className={styles.skeletionGroup}
          style={{ flex: 1, flexDirection: 'column', gap: '1.5rem' }}
        >
          <div className={styles.skeletionGroup} style={{ width: '100%' }}>
            <div
              className={styles.skeletionGroup}
              style={{ width: '100%', flexDirection: 'row', gap: '.75rem' }}
            >
              <div
                className={styles.skeletionGroup}
                style={{ width: '100%', flexDirection: 'column', gap: '.5rem' }}
              >
                <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
                <div className={styles.skeletonItem} style={{ width: '50%', height: '1rem' }} />
              </div>
              <div className={styles.skeletionGroup}>
                <div className={styles.skeletonItem} style={{ minWidth: '2rem', height: '2rem' }} />
              </div>
            </div>
          </div>
          <div
            className={styles.skeletionGroup}
            style={{ flexDirection: 'column', gap: '.25rem', width: '100%' }}
          >
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
            <div className={styles.skeletonItem} style={{ width: '100%', height: '1.2rem' }} />
          </div>
        </div>
      </div>
    </>
  );
};
