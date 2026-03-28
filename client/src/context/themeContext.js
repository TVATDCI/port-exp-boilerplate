import { createContext } from 'react';

const themeContext = createContext({
  isDarkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

export default themeContext;
