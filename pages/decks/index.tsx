import {
  Card,
  CardBody,
  Checkbox,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  MenuItemOption,
  Stack,
  StackItem,
  Switch,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { FilterMenu } from '../../src/components/common/FilterMenu';
import { OptionsMenu } from '../../src/components/common/OptionsMenu';
import SpriteDisplay from '../../src/components/common/SpriteDisplay';
import { DateRangeSlider } from '../../src/components/Deck/Analytics/Filter/DateRangeSlider';
import { TournamentSlider } from '../../src/components/Deck/Analytics/Filter/TournamentSlider';
import { useStoredDecks } from '../../src/hooks/finalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';

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
        {decks.map(({ deck, count }) => {
          const metaShare = (count / decks.length) * 10;

          if (!deck?.id) return null;

          return (
            <LinkBox
              {...(metaShare > 25 ? { gridColumn: '1/3' } : {})}
              key={deck.id}
            >
              <Card>
                <CardBody>
                  <Stack
                    direction={metaShare > 25 ? 'row' : 'column'}
                    alignItems={metaShare > 25 ? 'center' : 'baseline'}
                  >
                    <SpriteDisplay
                      big={metaShare > 25}
                      pokemonNames={deck.defined_pokemon}
                    />
                    <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
                      <Heading
                        color='gray.700'
                        size={metaShare > 25 ? 'md' : 'sm'}
                      >
                        {deck.name}
                      </Heading>
                      <Heading
                        color='gray.500'
                        size={metaShare > 25 ? 'sm' : 'xs'}
                      >
                        {metaShare.toFixed(2)}% share
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
