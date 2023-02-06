import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { BiggestMovers } from '../src/components/Home/BiggestMovers';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { TopDecks } from '../src/components/Home/TopDecks';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults';
import {
  fetchTournaments,
  usePatchedTournaments,
} from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { Tournament } from '../types/tournament';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  const { data: patchedTournaments } = usePatchedTournaments(tournaments);

  const mostRecentFinishedTournament = (patchedTournaments ?? tournaments).find(
    ({ tournamentStatus }) => tournamentStatus === 'finished'
  ) as Tournament;

  if (SHOULD_SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  return (
    <Fragment>
      <Stack>
        <AppLogo big />
        <RecentTournaments tournaments={patchedTournaments ?? tournaments} />
        <TopDecks tournament={mostRecentFinishedTournament} />
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
