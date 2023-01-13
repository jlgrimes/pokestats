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
    decksVisible: [],
  });

  const getFilter = useCallback(
    (key: keyof StandingsFilters, arg?: number) => {
      if (key === 'decksVisible')
        return !!standingsFilters.decksVisible.find(deckId => deckId === arg);
      return standingsFilters[key].value;
    },
    [standingsFilters]
  );

  const toggleFilter = useCallback(
    (key: keyof StandingsFilters, arg?: number) => {
      if (key === 'decksVisible' && arg) {
        if (standingsFilters.decksVisible.find(deck => deck === arg)) {
          return setStandingsFilters({
            ...standingsFilters,
            decksVisible: standingsFilters.decksVisible.filter(
              deck => deck !== arg
            ),
          });
        }

        return setStandingsFilters({
          ...standingsFilters,
          decksVisible: standingsFilters.decksVisible.concat(arg),
        });
      }

      if (key === 'day1') {
        return setStandingsFilters({
          ...standingsFilters,
          [key]: {
            ...standingsFilters[key],
            value: !standingsFilters[key].value,
          },
        });
      }
    },
    [standingsFilters]
  );

  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
    filters: standingsFilters,
  });

  return (
    <Stack>
      <StandingsFilterMenu
        getFilter={getFilter}
        toggleFilter={toggleFilter}
        tournament={tournament}
      />
      {liveResults && (
        <StandingsList results={liveResults.data} tournament={tournament} />
      )}
    </Stack>
  );
}
