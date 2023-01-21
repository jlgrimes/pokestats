import { dehydrate, QueryClient } from '@tanstack/react-query';
import TournamentView from '../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { fetchPokedex } from '../../../src/hooks/images';
import {
  fetchCurrentTournamentInfo,
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';

export default function TournamentPage({
  tournament,
}: {
  tournament: Tournament;
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <TournamentView tournament={tournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const currentLiveResults = await fetchLiveResults(params.id, {
    prefetch: true,
    load: { allRoundData: true },
  });

  queryClient.setQueryData(
    [`live-results`, params.id, 'allRoundData', true],
    () => currentLiveResults
  );

  // TODO: take out, might not need
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);
  await queryClient.prefetchQuery(['deck-archetypes'], fetchArchetypes);

  let tournament = await fetchCurrentTournamentInfo(params.id, {
    prefetch: true,
  });

  const tournamentApiSaysCompleted =
    tournament?.tournamentStatus === 'finished';
  const butTournamentIsRunning =
    currentLiveResults.data[0]?.rounds &&
    currentLiveResults.data[0]?.rounds?.length < 18;
  if (
    tournament &&
    currentLiveResults.data &&
    currentLiveResults.data.length > 0 &&
    tournamentApiSaysCompleted &&
    butTournamentIsRunning
  ) {
    tournament = {
      ...tournament,
      tournamentStatus: 'running',
    };
  }

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const paths = tournaments?.map(tournament => {
    return {
      params: {
        id: tournament.id,
        displayName: tournament.name,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}
