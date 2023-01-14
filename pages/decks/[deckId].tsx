import { fetchArchetype } from '../../src/hooks/deckArchetypes';
import {
  fetchUniqueDecks,
  useFinalResults,
} from '../../src/hooks/finalResults';
import { Deck } from '../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });
  console.log(deckStandings)

  return <div>hai</div>;
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
