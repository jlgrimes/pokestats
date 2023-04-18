import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
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
    </SessionContextProvider>
  );
}
