// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react';

// 2. Add your color mode config
const config = {
  fonts: {
    mono: `'Roboto Mono', sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
         _focus: {
          boxShadow: 'none'
        }
      }
    }
  },
};

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
