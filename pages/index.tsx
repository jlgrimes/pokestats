import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { Fragment } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { CommonCard } from '../src/components/common/CommonCard';
import { SeeMoreButton } from '../src/components/Deck/Analytics/SeeMoreButton';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { TournamentList } from '../src/components/TournamentList/TournamentList';
import { fetchPokedex } from '../src/hooks/images';
import { fetchSets } from '../src/hooks/sets';
import { fetchTournaments } from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { Tournament } from '../types/tournament';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  if (SHOULD_SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  return (
    <Fragment>
      <Stack>
        <RecentTournaments tournaments={tournaments} />
      </Stack>
    </Fragment>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);
  await queryClient.prefetchQuery([`sets`], fetchSets);

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
}
