import TournamentView from '../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import {
  fetchSingleTournament,
  fetchTournaments,
  usePatchedTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';

export default function TournamentPage({
  tournament,
}: {
  tournament: Tournament;
}) {
  const { data: patchedTournamentData } = usePatchedTournaments([tournament]);
  const patchedTournament = patchedTournamentData
    ? patchedTournamentData[0]
    : tournament;

  return (
    <TournamentPageLayout tournament={patchedTournament}>
      <TournamentView tournament={patchedTournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const tournament = await fetchSingleTournament(params.id);

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
