import { Grid, Stack, Switch } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { StandingsList } from '../DataDisplay/Standings/StandingsList';
import {
  StandingsFilterMenu,
  StandingsFilters,
} from './Results/StandingsFilterMenu';

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
  });

  const toggleFilter = useCallback(
    (key: keyof StandingsFilters) => {
      setStandingsFilters({
        ...standingsFilters,
        [key]: {
          ...standingsFilters[key],
          value: !standingsFilters[key].value,
        },
      });
    },
    [standingsFilters]
  );

  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
    filters: standingsFilters
  });

  return (
    <Stack>
      <StandingsFilterMenu
        filters={standingsFilters}
        toggleFilter={toggleFilter}
      />
      {liveResults && (
        <StandingsList results={liveResults.data} tournament={tournament} />
      )}
    </Stack>
  );
}
