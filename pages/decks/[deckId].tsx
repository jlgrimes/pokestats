import { Heading, HStack, Image, Stack } from '@chakra-ui/react';
import { DeckFinishes } from '../../src/components/Deck/Analytics/DeckFinishes';
import { DeckHeader } from '../../src/components/Deck/Analytics/DeckHeader';
import { DeckVariants } from '../../src/components/Deck/Analytics/DeckVariants';
import { getCardImageUrl } from '../../src/components/Deck/ListViewer/helpers';
import { fetchArchetype } from '../../src/hooks/deckArchetypes';
import { useCodeToSetMap } from '../../src/hooks/deckList';
import {
  fetchUniqueDecks,
  useFinalResults,
} from '../../src/hooks/finalResults';
import { Card, Deck } from '../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  return (
    <Stack padding={8}>
      <DeckHeader deck={deck} />
      <DeckVariants deck={deck} />
      <DeckFinishes deck={deck} />
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
