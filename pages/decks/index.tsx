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
  const decks = useStoredDecks({ tournamentRange });
  const previousDecks = useStoredDecks({
    tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
  });

  const getNumberOfDecks = (decks: { count: number; deck: Deck }[]) =>
    decks.reduce((acc, curr) => acc + (curr.count ?? 0), 0);

  return (
    <Stack>
      <StackItem paddingX={4}>
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
      <OptionsMenu>
        <Switch></Switch>
      </OptionsMenu>
      <Grid gridTemplateColumns={'1fr 1fr'} paddingY={4}>
        {decks.map(({ deck, count }, idx) => {
          const metaShare = (count / getNumberOfDecks(decks)) * 100;

          const previousMetaDeck =
            tournamentRange[0] === tournamentRange[1]
              ? previousDecks.find(
                  ({ deck: previousDeck }) => previousDeck.id === deck.id
                )
              : null;
          const previousMetaShare =
            tournamentRange[0] === tournamentRange[1] &&
            (previousMetaDeck?.count ?? 0 / getNumberOfDecks(previousDecks)) * 100;

          if (!deck?.id) return null;

          return (
            <LinkBox key={deck.id}>
              <Card>
                <CardBody>
                  <Stack direction={'column'} alignItems={'baseline'}>
                    <HStack>
                      <SpriteDisplay pokemonNames={deck.defined_pokemon} />
                      <Stat>
                        <StatNumber>{metaShare.toFixed(2)}%</StatNumber>
                        <StatHelpText>
                          <StatArrow type='increase' />
                          {previousMetaShare}%
                        </StatHelpText>
                      </Stat>
                    </HStack>
                    <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
                      <Heading
                        color='gray.700'
                        size={'md'}
                        wordBreak='break-word'
                      >
                        {deck.name}
                      </Heading>
                    </LinkOverlay>
                  </Stack>
                </CardBody>
              </Card>
            </LinkBox>
          );
        })}
      </Grid>
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
