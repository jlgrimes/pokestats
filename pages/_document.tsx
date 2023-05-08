import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import theme from '../styles/theme';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3066736963130742'
          crossOrigin='anonymous'
        ></script>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
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
