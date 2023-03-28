import { ColorMode, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className={styles[`container--toggle`]}>
      <input
        type='checkbox'
        id='toggle'
        className={styles['toggle--checkbox']}
        onChange={toggleColorMode}
        checked={colorMode === 'light'}
      />
      <label htmlFor='toggle' className={styles[`toggle--label`]}>
        <span className={styles[`toggle--label-background`]}></span>
      </label>
    </div>
  );
};
