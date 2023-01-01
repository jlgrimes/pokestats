import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <AppLayout session={session} dehydratedState={pageProps.dehydratedState}>
      <Component {...pageProps} />
    </AppLayout>
  );
}
