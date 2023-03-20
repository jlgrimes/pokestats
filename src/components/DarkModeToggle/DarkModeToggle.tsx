import { ColorMode, useColorMode } from '@chakra-ui/react';
import styles from './styles.module.css';

export const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className={styles[`container--toggle`]}>
      {colorMode === 'light' ? (
        <input
          type='checkbox'
          id='toggle'
          className={styles['toggle--checkbox']}
          onClick={toggleColorMode}
          checked
        />
      ) : (
        <input
          type='checkbox'
          id='toggle'
          className={styles['toggle--checkbox']}
          onClick={toggleColorMode}
        />
      )}
      <label htmlFor='toggle' className={styles[`toggle--label`]}>
        <span className={styles[`toggle--label-background`]}></span>
      </label>
    </div>
  );
};
