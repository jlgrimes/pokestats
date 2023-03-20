import { createContext } from 'react';

export const darkModeContext = createContext({
  darkMode: false,
  setDarkMode: (should: boolean) => {},
});
