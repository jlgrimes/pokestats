import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { getMostRecentTournaments } from '../src/components/TournamentList/helpers';
import { fetchFinalResults } from '../src/hooks/finalResults';
import { TournamentOrSet } from '../src/hooks/sets';
import { fetchTournamentMetadata } from '../src/hooks/tournamentMetadata';
import {
  fetchTournaments,
  getTournamentsThatNeedToBePatched,
  usePatchedTournaments,
} from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { prewarmLiveTournamentData } from '../src/lib/fetch/cache-prewarm';
import { Tournament } from '../types/tournament';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  const { data: patchedTournaments } = usePatchedTournaments(tournaments);
  const queryClient = useQueryClient();

  useEffect(() => {
    prewarmLiveTournamentData(queryClient, tournaments);
  }, []);

  if (SHOULD_SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  return (
    <Fragment>
      <Stack>
        <AppLogo big />
        <RecentTournaments tournaments={patchedTournaments ?? tournaments} />
        {/* <TopDecks tournament={mostRecentFinishedTournament} /> */}
      </Stack>
    </Fragment>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['all-tournament-metadata'],
    queryFn: () => fetchTournamentMetadata(),
  });

  await queryClient.prefetchQuery({
    queryKey: [
      'final-results',
      {
        placing: 1,
      },
    ],
    queryFn: () => fetchFinalResults({ placing: 1 }),
  });

  const tournies = getMostRecentTournaments(
    tournaments.map(
      tournament =>
        ({ type: 'tournament', data: tournament } as TournamentOrSet)
    )
  ).items.map(({ data }) => data as Tournament);

  for (const tournament of getTournamentsThatNeedToBePatched(tournies))
    await queryClient.prefetchQuery({
      queryKey: ['patched-tournament', tournament.id],
      queryFn: () => tournament,
    });

  return {
    props: {
      tournaments: tournies,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
