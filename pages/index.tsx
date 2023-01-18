import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { BiggestMovers } from '../src/components/Home/BiggestMovers';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { RecentTournaments } from '../src/components/Home/RecentTournaments';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults';
import { fetchPokedex } from '../src/hooks/images';
import { fetchSets } from '../src/hooks/sets';
import { fetchTournaments } from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { fetchLiveResults } from '../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../types/tournament';

export default function Home({
  tournaments,
  mostRecentFinishedTournament,
}: {
  tournaments: Tournament[];
  mostRecentFinishedTournament: Tournament;
}) {
  if (SHOULD_SHOW_COMING_SOON) {
    return <ComingSoonPage />;
  }

  return (
    <Fragment>
      <Stack>
        <AppLogo big />
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

  const mostRecentFinishedTournament = tournaments
    .slice()
    .reverse()
    .find(
      ({ tournamentStatus }) => tournamentStatus === 'finished'
    ) as Tournament;

  await queryClient.prefetchQuery(
    [`live-results`, mostRecentFinishedTournament.id, 'allRoundData', true],
    () =>
      fetchLiveResults(mostRecentFinishedTournament.id, {
        prefetch: true,
        load: { allRoundData: true },
      })
  );
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
      mostRecentFinishedTournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
}
