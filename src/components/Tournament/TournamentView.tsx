import { Grid, Stack, Switch } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { StandingsList } from '../DataDisplay/Standings/StandingsList';
import { StandingsFilterContainer } from './Results/Filters/StandingsFilterContainer';
import {
  StandingsFilterMenu,
  StandingsFilters,
} from './Results/Filters/StandingsFilterMenu';

export default function TournamentView({
  tournament,
}: {
  tournament: Tournament;
}) {
  const [standingsFilters, setStandingsFilters] = useState<StandingsFilters>({
    day1: {
      name: 'Day 1',
      value: true,
    },
    decksVisible: [],
  });

  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
    filters: standingsFilters,
  });

  return (
    <Stack>
      <StandingsFilterContainer
        tournament={tournament}
        standingsFilters={standingsFilters}
        setStandingsFilters={setStandingsFilters}
      />
      {liveResults && (
        <StandingsList results={liveResults.data} tournament={tournament} />
      )}
    </Stack>
  );
}
