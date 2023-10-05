import TournamentView from '../../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../../src/components/Tournament/TournamentPageLayout';
import {
  fetchSingleTournament,
  fetchTournaments,
} from '../../../../src/hooks/tournaments';
import { Tournament } from '../../../../types/tournament';
import { AgeDivision } from '../../../../types/age-division';

export default function TournamentPage({
  tournament,
  ageDivision
}: {
  tournament: Tournament;
  ageDivision: AgeDivision;
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <TournamentView tournament={tournament} ageDivision={ageDivision} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string, division: string } }) {
  const tournament = await fetchSingleTournament(params.id);

  return {
    props: {
      tournament,
      ageDivision: params.division
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
