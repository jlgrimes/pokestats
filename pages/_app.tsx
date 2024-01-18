import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useEffect, useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3066736963130742'
        crossOrigin='anonymous'
      ></script>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      <AppLayout dehydratedState={pageProps.dehydratedState}>
        {/* <Head>
          <script
            async
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3066736963130742'
            crossOrigin='anonymous'
          ></script>
        </Head> */}
        <Head>
          <link rel="manifest" href="/app.webmanifest" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
        <SpeedInsights route={router.pathname} />
      </AppLayout>
    </SessionContextProvider>
  );
}
