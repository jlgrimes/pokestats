import { RouterContext } from "next/dist/shared/lib/router-context";

const customViewports = {
  iPhone14: {
    name: 'iPhone 14 Safari',
    styles: {
      width: '393px',
      height: '660px'
    }
  }
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  viewport: {
    defaultViewport: 'iPhone14',
    viewports: customViewports
  }
}

import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => (
    <OriginalNextImage
      {...props}
      unoptimized
    />
  ),
});