import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Tournament from '../src/components/Tournament/Tournament';
import { TournamentList } from '../src/components/TournamentList/TournamentList';
import supabase from '../src/lib/supabase/client';
import styles from '../styles/Home.module.css';

export default function Home({ tournaments }: { tournaments: { id: string, name: string }[] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokestats</title>
        <meta name='description' content='Pokestats' />
        <meta
          name='google-signin-client_id'
          content='308312836672-mpph1meqftrivs6qavnechv75fttp3g5.apps.googleusercontent.com'
        ></meta>
        <script
          src='https://apis.google.com/js/platform.js'
          async
          defer
        ></script>

        <link rel='icon' href='/favicon.ico' />
      </Head>
      <TournamentList tournaments={tournaments} />
    </div>
  );
}

export async function getStaticProps() {
  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');

  return {
    props: { tournaments },
  };
}
