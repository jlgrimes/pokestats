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
import SpriteDisplay from '../../src/components/common/SpriteDisplay';
import { useStoredDecks } from '../../src/hooks/finalResults';

export default function DecksPage() {
  const decks = useStoredDecks();
  console.log(decks);
  return (
    <Grid gridTemplateColumns={'1fr 1fr'} paddingX={8} paddingY={4}>
      {decks.map(({ deck, count }) => (
        <LinkBox key={deck.id}>
          <Card>
            <CardBody>
              <Stack>
                <SpriteDisplay pokemonNames={deck.defined_pokemon} />
                <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
                  <Heading color='gray.700' size='xs'>
                    {deck.name}
                  </Heading>
                </LinkOverlay>
              </Stack>
            </CardBody>
          </Card>
        </LinkBox>
      ))}
    </Grid>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10,
  };
}
