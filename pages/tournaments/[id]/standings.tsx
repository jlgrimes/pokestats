import { dehydrate, QueryClient } from '@tanstack/react-query';
import TournamentView from '../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { fetchPokedex } from '../../../src/hooks/images';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { getPatchedTournament } from '../../../src/lib/patches';
import { fetchTournamentMetadata } from '../../../src/hooks/tournamentMetadata';

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
  // TODO: update with other tournament metadata if needed
  await queryClient.prefetchQuery(
    ['tournament-metadata', params.id, 'stream'],
    () => fetchTournamentMetadata(params.id, 'stream')
  );

  let [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });
  queryClient.setQueryData(['tournaments', params.id], () => tournament);

  tournament = (await getPatchedTournament(
    tournament,
    currentLiveResults,
    true
  )) as Tournament;

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    excludeUpcoming: true,
  });
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
