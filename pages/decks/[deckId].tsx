import { Button, Stack } from '@chakra-ui/react';
import { BackToDecksButton } from '../../src/components/Deck/Analytics/BackToDecksButton';
import { CardCounts } from '../../src/components/Deck/Analytics/CardCounts';
import { DeckFinishes } from '../../src/components/Deck/Analytics/DeckFinishes';
import { DeckHeader } from '../../src/components/Deck/Analytics/DeckHeader';
import { DeckVariants } from '../../src/components/Deck/Analytics/DeckVariants';
import { fetchArchetype } from '../../src/hooks/deckArchetypes';
import { fetchUniqueDecks } from '../../src/hooks/finalResults';
import { Deck } from '../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  return (
    <Stack spacing={4} paddingLeft={4}>
      <BackToDecksButton />
      <Stack>
        <DeckHeader deck={deck} />
        <DeckVariants deck={deck} />
      </Stack>
      <CardCounts deck={deck} />
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
