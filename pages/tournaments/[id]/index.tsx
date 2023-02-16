import { TournamentHomeView } from '../../../src/components/Tournament/Home/TournamentHomeView';
import {
  fetchTournaments,
  usePatchedTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage(props: TournamentPageProps) {
  const { data: patchedTournamentData } = usePatchedTournaments([
    props.tournament,
  ]);
  console.log(patchedTournamentData)
  const patchedTournament = patchedTournamentData?.at(0);

  return (
    <TournamentHomeView tournament={patchedTournament ?? props.tournament} />
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });

  return {
    props: {
      tournament,
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
