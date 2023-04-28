import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import theme from '../styles/theme';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <Script
          id='3850744716'
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3066736963130742'
          crossOrigin='anonymous'
          data-ad-client='ca-pub-3066736963130742'
          strategy='beforeInteractive'
        />
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
