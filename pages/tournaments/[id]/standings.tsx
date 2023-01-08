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
  await queryClient.prefetchQuery([`live-results`, params.id, 'allRoundData', true], () =>
    fetchLiveResults(params.id, {
      prefetch: true,
      load: { allRoundData: true },
    })
  );
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);

  const tournament = await fetchCurrentTournamentInfo(params.id, {
    prefetch: true,
  });

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
