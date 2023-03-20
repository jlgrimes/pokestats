import { useContext } from 'react';
import { darkModeContext } from '../../contexts/DarkModeContext';
import styles from './styles.module.css';

export const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(darkModeContext);

  return (
    <div className={styles[`container--toggle`]}>
      {!darkMode ? (
        <input
          type='checkbox'
          id='toggle'
          className={styles['toggle--checkbox']}
          onClick={() => setDarkMode(!darkMode)}
          checked
        />
      ) : (
        <input
          type='checkbox'
          id='toggle'
          className={styles['toggle--checkbox']}
          onClick={() => setDarkMode(!darkMode)}
        />
      )}
      <label htmlFor='toggle' className={styles[`toggle--label`]}>
        <span className={styles[`toggle--label-background`]}></span>
      </label>
    </div>
  );
};
