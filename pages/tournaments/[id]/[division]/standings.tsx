import TournamentView from '../../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../../src/components/Tournament/TournamentPageLayout';
import {
  fetchSingleTournament,
  fetchTournaments,
} from '../../../../src/hooks/tournaments';
import { Tournament } from '../../../../types/tournament';
import { AgeDivision } from '../../../../types/age-division';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchStandings } from '../../../../src/hooks/newStandings';
import { createContext, useState } from 'react';

export const StandingsPageContext = createContext({
  shouldShowMatchPoints: false,
  setShouldShowMatchPoints: (should: boolean) => {}
});

export default function TournamentPage({
  tournament,
  ageDivision
}: {
  tournament: Tournament;
  ageDivision: AgeDivision;
}) {
  const [shouldShowMatchPoints, setShouldShowMatchPoints] = useState(false);
  return (
    <StandingsPageContext.Provider value={{ shouldShowMatchPoints, setShouldShowMatchPoints }}>
      <TournamentPageLayout tournament={tournament}>
        <TournamentView tournament={tournament} ageDivision={ageDivision} />
      </TournamentPageLayout>
    </StandingsPageContext.Provider>
  );
}

export async function getServerSideProps({ params }: { params: { id: string, division: string } }) {
  const queryClient = new QueryClient();
  const tournament = await fetchSingleTournament(params.id);

  if (tournament?.tournamentStatus === 'finished') {
    await queryClient.prefetchQuery({
      queryKey: ['standings', tournament.id, params.division],
      queryFn: () => fetchStandings({ tournament, ageDivision: params.division as AgeDivision }),
    });
  }

  return {
    props: JSON.parse(JSON.stringify({
      tournament,
      ageDivision: params.division,
      dehydratedState: dehydrate(queryClient),
    }))
  };
}