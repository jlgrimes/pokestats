import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Tournament } from '../../../types/tournament';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { Ad } from '../Ad';
import { Banner } from '../common/Banner';
import { FullPageLoader } from '../common/FullPageLoader';
import { SorryText } from '../common/SorryText';
import { StatsHeading } from '../common/StatsHeading';
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

  const { data: liveResults, isLoading } = useLiveTournamentResults(
    tournament.id,
    {
      load: { allRoundData: true },
      filters: standingsFilters,
    }
  );
  console.log(isLoading)

  if (isLoading) return <FullPageLoader />;

  if (!isLoading && liveResults?.data.length === 0)
    return (
      <SorryText>
        {`Sorry, we're unable to retrieve standings right now. Please try again later.`}
      </SorryText>
    );

  return (
    <Stack height='100%'>
      {/* {tournament.hasStaleData && (
        <Banner color='yellow'>
          <Text>These standings are not final standings. RK9 is not currently updated, hang tight!</Text>
        </Banner>
      )} */}

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
