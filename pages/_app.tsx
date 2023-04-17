import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppLayout dehydratedState={pageProps.dehydratedState}>
        {/* <Head>
          <script
            async
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3066736963130742'
            crossOrigin='anonymous'
          ></script>
        </Head> */}
        <Component {...pageProps} />
        <Analytics />
      </AppLayout>
    </SessionProvider>
  );
}
