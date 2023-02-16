import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { TopDecks } from '../src/components/Home/TopDecks';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { getMostRecentTournaments } from '../src/components/TournamentList/helpers';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults';
import { TournamentOrSet } from '../src/hooks/sets';
import {
  fetchTournaments,
  getMostRecentFinishedTournament,
  usePatchedTournaments,
} from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { prewarmMostRecentTournament } from '../src/lib/fetch/cache-prewarm';
import { Tournament } from '../types/tournament';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  const tournies = getMostRecentTournaments(
    tournaments.map(
      tournament =>
        ({ type: 'tournament', data: tournament } as TournamentOrSet)
    )
  ).items.map(({ data }) => data as Tournament);
  const { data: patchedTournaments } = usePatchedTournaments(tournies);
  const mostRecentFinishedTournament = getMostRecentFinishedTournament(
    patchedTournaments ?? tournaments ?? []
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    prewarmMostRecentTournament(queryClient);
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
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });
  await queryClient.prefetchQuery({
    queryKey: ['decks-with-lists'],
    queryFn: () => fetchDecksWithLists(),
  });

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
