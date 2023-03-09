import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  StackItem,
  Switch,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { CommonCard } from '../src/components/common/CommonCard';
import { useArchetypes, fetchArchetypes } from '../src/hooks/deckArchetypes';
import SpriteDisplay from '../src/components/common/SpriteDisplay/SpriteDisplay';
import { StatsHeading } from '../src/components/common/StatsHeading';

export default function AllDecksPage() {
  const { data: allDecks } = useArchetypes();

  return (
    <CommonCard header={'All archetypes'} ghost>
      <Stack>
        {allDecks?.map(deck => (
          <LinkBox key={deck.id}>
            <LinkOverlay
              as={NextLink}
              href={`/decks/${deck.supertype?.id}/${deck.id}`}
            >
              <Card>
                <CardBody paddingY={4}>
                  <Grid gridTemplateColumns={'6rem auto'} alignItems='center'>
                    <SpriteDisplay pokemonNames={deck.defined_pokemon} />
                    <StatsHeading
                      headingProps={{
                        color: 'gray.600',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {deck.name}
                    </StatsHeading>
                  </Grid>
                </CardBody>
              </Card>
            </LinkOverlay>
          </LinkBox>
        ))}
      </Stack>
    </CommonCard>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
