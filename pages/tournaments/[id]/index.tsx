import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TournamentHomeView } from '../../../src/components/Tournament/Home/TournamentHomeView';
import { fetchOneTournamentMetadata } from '../../../src/hooks/tournamentMetadata';
import {
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage(props: TournamentPageProps) {
  return <TournamentHomeView tournament={props.tournament} />;
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });

  await queryClient.prefetchQuery({
    queryKey: ['tournament-metadata', tournament.id],
    queryFn: () => fetchOneTournamentMetadata(tournament.id),
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
