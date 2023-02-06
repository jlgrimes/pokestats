import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { prewarmMostRecentTournament } from '../src/lib/fetch/cache-prewarm';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    prewarmMostRecentTournament();
  }, []);

  return (
    <SessionProvider session={session}>
      <AppLayout dehydratedState={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <Analytics />
      </AppLayout>
    </SessionProvider>
  );
}
