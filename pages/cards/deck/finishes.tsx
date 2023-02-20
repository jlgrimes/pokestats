import { DeckAnalyticsContainer } from '../../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckFinishes } from '../../../src/components/Deck/Analytics/DeckFinishes';
import { fetchArchetype } from '../../../src/hooks/deckArchetypes';
import { fetchUniqueDecks } from '../../../src/hooks/finalResults';
import { Deck } from '../../../types/tournament';

export default function DeckFinishesPage({ deck }: { deck: Deck }) {
  return (
    <DeckAnalyticsContainer deck={deck} compactTitle>
      <DeckFinishes deck={deck} />
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
