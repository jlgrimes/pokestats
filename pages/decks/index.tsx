import {
  Card,
  CardBody,
  Checkbox,
  Grid,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  MenuItemOption,
  Stack,
  StackItem,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import { FilterMenu } from '../../src/components/common/FilterMenu';
import { OptionsMenu } from '../../src/components/common/OptionsMenu';
import SpriteDisplay from '../../src/components/common/SpriteDisplay';
import { DateRangeSlider } from '../../src/components/Deck/Analytics/Filter/DateRangeSlider';
import { TournamentSlider } from '../../src/components/Deck/Analytics/Filter/TournamentSlider';
import { MetaGameShareList } from '../../src/components/Deck/Analytics/MetaGameShare/MetaGameShareList';
import { fixPercentage } from '../../src/components/Deck/ListViewer/CardViewer.tsx/helpers';
import { useStoredDecks } from '../../src/hooks/finalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Deck, Tournament } from '../../types/tournament';

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
  const [showRange, setShowRange] = useState(false);

  return (
    <Stack>
      <StackItem>
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
    <MetaGameShareList tournamentRange={tournamentRange} />
    </Stack>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    onlyFinished: true,
  });
  return {
    props: {
      defaultTournamentRange: [
        parseInt(tournaments[0].id),
        parseInt(tournaments[tournaments.length - 1].id),
      ],
      tournaments,
    },
    revalidate: 10,
  };
}
