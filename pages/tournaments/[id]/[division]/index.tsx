import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TournamentHomeView } from '../../../../src/components/Tournament/Home/TournamentHomeView';
import { fetchFinalResults } from '../../../../src/hooks/finalResults/fetch';
import { fetchOneTournamentMetadata } from '../../../../src/hooks/tournamentMetadata';
import {
  fetchTournaments,
  usePatchedTournaments,
} from '../../../../src/hooks/tournaments';
import { Tournament } from '../../../../types/tournament';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage(props: TournamentPageProps) {
  const { data: patchedTournamentData } = usePatchedTournaments([
    props.tournament,
  ]);
  const patchedTournament = patchedTournamentData
    ? patchedTournamentData[0]
    : props.tournament;

  return <TournamentHomeView tournament={patchedTournament} />;
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });

  if (tournament.tournamentStatus === 'finished') {
    await queryClient.prefetchQuery({
      queryKey: [
        'final-results',
        {
          tournamentId: tournament.id,
          minimumPlacing: 8
        },
      ],
      queryFn: () => fetchFinalResults({ tournamentId: tournament.id, minimumPlacing: 8 }),
    });
  }

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
        division: 'masters',
        displayName: tournament.name,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}
