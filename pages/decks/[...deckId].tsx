import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { DeckAnalyticsContainer } from '../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckVariants } from '../../src/components/Deck/Analytics/DeckVariants';
import { PopularTechsCard } from '../../src/components/Deck/Analytics/PopularTechsCard';
import { RecentFinishesCard } from '../../src/components/Deck/Analytics/RecentFinishesCard';
import {
  fetchArchetype,
  fetchSupertype,
  fetchSupertypes,
  fetchVariants,
} from '../../src/hooks/deckArchetypes';
import { fetchCodeToSetMap } from '../../src/hooks/deckList';
import {
  fetchFinalResults,
  fetchUniqueDecks,
} from '../../src/hooks/finalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Deck } from '../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  return (
    <DeckAnalyticsContainer deck={deck}>
      <Fragment>
        <RecentFinishesCard deck={deck} />
        <PopularTechsCard deck={deck} />
      </Fragment>
    </DeckAnalyticsContainer>
  );
}

const invalidDeckReturn = {
  props: {
    deck: null,
  },
  revalidate: 10,
};

export async function getStaticProps({
  params,
}: {
  params: { deckId: string[] };
}) {
  const supertypeId = parseInt(params.deckId[0]);
  const archetypeId =
    params.deckId.length >= 1 ? parseInt(params.deckId[1]) : undefined;

  const queryClient = new QueryClient();

  let deck: Deck | null | undefined;

  if (archetypeId) {
    deck = await fetchArchetype(archetypeId);
  } else if (supertypeId) {
    deck = await fetchSupertype(supertypeId);
  }

  if (!deck) return invalidDeckReturn;

  await queryClient.prefetchQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments({ prefetch: true }),
  });
  await queryClient.prefetchQuery({
    queryKey: [
      'final-results',
      {
        supertypeId,
        deckId: archetypeId,
      },
    ],
    queryFn: () => fetchFinalResults({ deckId: archetypeId, supertypeId }),
  });

  if (deck.supertype) {
    await queryClient.prefetchQuery({
      queryKey: ['deck-variants', deck.supertype],
      queryFn: () => fetchVariants(deck!.supertype!.id),
    });
  }

  await queryClient.prefetchQuery({
    queryKey: ['code-to-set-map'],
    queryFn: () => fetchCodeToSetMap(),
  });

  return {
    props: {
      deck: {
        ...deck,
        classification: archetypeId ? 'archetype' : 'supertype',
      },
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const decks = await fetchUniqueDecks();
  console.log(decks);

  return {
    paths: decks.map(({ deck_archetype }) => ({
      params: {
        deckId: deck_archetype,
      },
    })),
    fallback: 'blocking',
  };
}
