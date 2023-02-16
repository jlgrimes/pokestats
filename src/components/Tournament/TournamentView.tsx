import { Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Tournament } from '../../../types/tournament';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { Banner } from '../common/Banner';
import { StandingsList } from '../DataDisplay/Standings/StandingsList';
import { StandingsFilterContainer } from './Results/Filters/StandingsFilterContainer';
import { StandingsFilters } from './Results/Filters/StandingsFilterMenu';

export default function TournamentView({
  tournament,
}: {
  tournament: Tournament;
}) {
  const [standingsFilters, setStandingsFilters] = useState<StandingsFilters>({
    justDay2: {
      name: 'Day 2',
      value: false,
    },
    onStream: {
      name: 'On stream',
      value: false,
    },
    deckKnown: {
      name: 'Deck known',
      value: false,
    },
    decksVisible: [],
  });

  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
    filters: standingsFilters,
  });

  return (
    <Stack height='100%'>
      {tournament.hasStaleData && (
        <Banner color='yellow'>
          <Text>These standings are not final standings. RK9 is not currently updated, hang tight!</Text>
        </Banner>
      )}
      <StandingsFilterContainer
        tournament={tournament}
        standingsFilters={standingsFilters}
        setStandingsFilters={setStandingsFilters}
        disabled={liveResults?.shouldHideDecks}
      />
      {liveResults && (
        <StandingsList
          results={liveResults.data}
          tournament={tournament}
          shouldHideDecks={liveResults.shouldHideDecks}
        />
      )}
    </Stack>
  );
}
