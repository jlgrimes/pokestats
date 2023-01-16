import { Button, Stack } from '@chakra-ui/react';
import { Fragment } from 'react';
import { BackToDecksButton } from '../../../src/components/Deck/Analytics/BackToDecksButton';
import { CardCounts } from '../../../src/components/Deck/Analytics/CardCounts/CardCounts';
import { DeckAnalyticsContainer } from '../../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckFinishes } from '../../../src/components/Deck/Analytics/DeckFinishes';
import { DeckVariants } from '../../../src/components/Deck/Analytics/DeckVariants';
import { fetchArchetype } from '../../../src/hooks/deckArchetypes';
import { fetchUniqueDecks } from '../../../src/hooks/finalResults';
import { Deck } from '../../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  return (
    <DeckAnalyticsContainer deck={deck}>
      <Fragment>
        <DeckVariants deck={deck} />
        <CardCounts deck={deck} />
        <DeckFinishes deck={deck} />
      </Fragment>
    </DeckAnalyticsContainer>
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
