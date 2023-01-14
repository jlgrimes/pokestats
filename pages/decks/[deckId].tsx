import { Heading, HStack, Image, Stack } from '@chakra-ui/react';
import { getCardImageUrl } from '../../src/components/Deck/ListViewer/helpers';
import { fetchArchetype } from '../../src/hooks/deckArchetypes';
import { useCodeToSetMap } from '../../src/hooks/deckList';
import {
  fetchUniqueDecks,
  useFinalResults,
} from '../../src/hooks/finalResults';
import { Card, Deck } from '../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });
  const codeToSetMap = useCodeToSetMap();

  const identifiableCards = deck.identifiable_cards
    ?.map(cardName => {
      return deckStandings?.[0].deck_list?.pokemon.find(
        ({ name }) => name === cardName
      );
    })
    .filter(card => card);

  const heightWidthRatio = 1.396;
  const width = 150;
  const height = width * heightWidthRatio;

  return (
    <Stack padding={8} spacing={4}>
      <HStack spacing={0}>
        {identifiableCards?.map(card => (
          <Image
            key={`${card?.name} ${card?.set}`}
            width={`${width}px`}
            height={`${height}px`}
            src={getCardImageUrl(card as Card, codeToSetMap, { highRes: true })}
            alt={`${card?.name} ${card?.set}`}
          />
        ))}
      </HStack>
      <Heading color='gray.700'>{deck.name}</Heading>
    </Stack>
  );
}

export async function getStaticProps({
  params,
}: {
  params: {
    deckId: number;
  };
}) {
  const deck = await fetchArchetype(params.deckId);

  return {
    props: {
      deck,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const decks = await fetchUniqueDecks();

  return {
    paths: decks.map(({ deck_archetype }) => ({
      params: {
        deckId: deck_archetype,
      },
    })),
    fallback: 'blocking',
  };
}
