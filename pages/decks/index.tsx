import { Stack, StackItem, Switch } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DateRangeSlider } from '../../src/components/Deck/Analytics/Filter/DateRangeSlider';
import { TournamentSlider } from '../../src/components/Deck/Analytics/Filter/TournamentSlider';
import { MetaGameShareList } from '../../src/components/Deck/Analytics/MetaGameShare/MetaGameShareList';
import { fixPercentage } from '../../src/components/Deck/ListViewer/CardViewer.tsx/helpers';
import {
  fetchDecksWithLists,
  useStoredDecks,
} from '../../src/hooks/finalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';
import { fetchArchetypes } from '../../src/hooks/deckArchetypes';

export default function DecksPage({
  defaultTournamentRange,
  tournaments,
}: {
  defaultTournamentRange: number[];
  tournaments: Tournament[] | undefined;
}) {
  const [tournamentRange, setTournamentRange] = useState([
    tournaments?.length ?? 0,
    tournaments?.length ?? 0,
  ]);
  const [sortByMoves, setSortByMoves] = useState(false);
  const [showRange, setShowRange] = useState(false);

  return (
    <Stack padding={4} height='100%'>
      <StackItem>
        <Switch
          checked={sortByMoves}
          onChange={() => setSortByMoves(!sortByMoves)}
        >
          Sort by biggest moves
        </Switch>
        {showRange ? (
          <DateRangeSlider
            tournamentFilter={tournamentRange}
            setTournamentFilter={setTournamentRange}
            defaultTournamentRange={defaultTournamentRange}
            tournaments={tournaments}
          />
        ) : (
          <TournamentSlider
            tournamentFilter={tournamentRange[0]}
            setTournamentFilter={num => setTournamentRange([num, num])}
            defaultTournamentRange={defaultTournamentRange}
            tournaments={tournaments}
          />
        )}
      </StackItem>
      {/* <OptionsMenu>
        <Switch></Switch>
      </OptionsMenu> */}
      <MetaGameShareList
        tournamentRange={tournamentRange}
        sortByMoves={sortByMoves}
      />
    </Stack>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    onlyFinished: true,
  });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['decks-with-lists'],
    queryFn: () => fetchDecksWithLists(),
  });
  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });

  return {
    props: {
      defaultTournamentRange: [
        parseInt(tournaments[tournaments.length - 1].id),
        parseInt(tournaments[0].id),
      ],
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
