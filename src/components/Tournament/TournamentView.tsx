import { Stack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Tournament } from '../../../types/tournament';
import { AgeDivision } from '../../../types/age-division';
import { FullPageLoader } from '../common/FullPageLoader';
import { SorryText } from '../common/SorryText';
import { StandingsList } from '../DataDisplay/Standings/StandingsList';
import { StandingsFilterContainer } from './Results/Filters/StandingsFilterContainer';
import { StandingsFilters } from './Results/Filters/StandingsFilterMenu';
import { useStandings } from '../../hooks/newStandings';
import { getShouldHideDecks } from '../../hooks/tournaments';
import { StandingsPageContext } from '../../../pages/tournaments/[id]/[division]/standings';

export default function TournamentView({
  tournament,
  ageDivision
}: {
  tournament: Tournament;
  ageDivision: AgeDivision
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

  const { data: liveResults, isLoading } = useStandings({
    tournament,
    ageDivision
  });
  const { nameFilter } = useContext(StandingsPageContext);

  const shouldHideDecks = getShouldHideDecks(tournament, ageDivision);

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
      {/* <StandingsFilterContainer
        tournament={tournament}
        standingsFilters={standingsFilters}
        setStandingsFilters={setStandingsFilters}
        disabled={shouldHideDecks}
      /> */}
      {liveResults && (
        <StandingsList
          results={liveResults.filter(({ name }) => nameFilter.length === 0 || name.toLowerCase().includes(nameFilter.toLowerCase()))}
          tournament={tournament}
          shouldHideDecks={shouldHideDecks}
        />
      )}
    </Stack>
  );
}
