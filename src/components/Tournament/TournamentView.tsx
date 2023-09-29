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
import { useStandings } from '../../hooks/newStandings';

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
    supertypesVisible: []
  });

  const { data: liveResults, isLoading } = useStandings(parseInt(tournament.id))
  // TODO PLEASE CHANGE THIS
  const shouldHideDecks = false;
  console.log(liveResults)

  if (isLoading) return <FullPageLoader />;

  if (!isLoading && liveResults?.length === 0)
    return (
      <SorryText>
        {`Sorry, we're unable to retrieve standings right now. Please try again later.`}
      </SorryText>
    );

  return (
    <Stack height='100%' id='tournament-view'>
      {/* {tournament.hasStaleData && (
        <Banner color='yellow'>
          <Text>These standings are not final standings. RK9 is not currently updated, hang tight!</Text>
        </Banner>
      )} */}
      <StandingsFilterContainer
        tournament={tournament}
        standingsFilters={standingsFilters}
        setStandingsFilters={setStandingsFilters}
        disabled={shouldHideDecks}
      />
      {liveResults && (
        <StandingsList
          results={liveResults}
          tournament={tournament}
          shouldHideDecks={shouldHideDecks}
        />
      )}
    </Stack>
  );
}
