import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { BiggestMovers } from '../src/components/Home/BiggestMovers';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { fetchPokedex } from '../src/hooks/images';
import { fetchSets } from '../src/hooks/sets';
import { fetchTournaments } from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { Tournament } from '../types/tournament';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  if (SHOULD_SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  const mostRecentFinishedTournament = tournaments
    .slice()
    .reverse()
    .find(
      ({ tournamentStatus }) => tournamentStatus === 'finished'
    ) as Tournament;

  return (
    <Fragment>
      <Stack>
        <MyMostRecentResults tournaments={tournaments} />
        <RecentTournaments tournaments={tournaments} />
        <BiggestMovers tournament={mostRecentFinishedTournament} />
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
