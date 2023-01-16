import {
  Card,
  CardBody,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { FilterMenu } from '../../src/components/common/FilterMenu';
import SpriteDisplay from '../../src/components/common/SpriteDisplay';
import { DeckFilterBody } from '../../src/components/Deck/Analytics/Filter/DeckFilterBody';
import { useStoredDecks } from '../../src/hooks/finalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';

export default function DecksPage({
  defaultTournamentRange,
}: {
  defaultTournamentRange: number[];
}) {
  const [tournamentRange, setTournamentRange] = useState(
    defaultTournamentRange
  );
  const decks = useStoredDecks({ tournamentRange });
  return (
    <Stack>
      <FilterMenu>
        <DeckFilterBody
          tournamentFilter={tournamentRange}
          setTournamentFilter={setTournamentRange}
          defaultTournamentRange={defaultTournamentRange}
        />
      </FilterMenu>
      <Grid gridTemplateColumns={'1fr 1fr'} paddingY={4}>
        {decks.map(({ deck, count }) => {
          const metaShare = (count / decks.length) * 10;
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
  const tournaments = await fetchTournaments({ prefetch: true });
  return {
    props: {
      defaultTournamentRange: [
        parseInt(tournaments[0].id),
        parseInt(tournaments[tournaments.length - 1].id),
      ],
    },
    revalidate: 10,
  };
}
