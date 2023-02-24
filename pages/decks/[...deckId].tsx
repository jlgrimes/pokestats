import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { CardCounts } from '../../src/components/Deck/Analytics/CardCounts/CardCounts';
import { DeckAnalyticsContainer } from '../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckFinishes } from '../../src/components/Deck/Analytics/DeckFinishes';
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
} from '../../src/hooks/finalResults/useFinalResults';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { parseDeckUrlParams } from '../../src/lib/query-params';
import { Deck } from '../../types/tournament';

export default function DeckPage({
  deck,
  slug,
}: {
  deck: Deck;
  slug: string | null;
}) {
  return (
    <DeckAnalyticsContainer deck={deck} compactTitle={!!slug}>
      <Fragment>
        {slug === 'cards' && <CardCounts deck={deck} />}
        {slug === 'finishes' && <DeckFinishes deck={deck} />}
        {slug === null && (
          <Fragment>
            <RecentFinishesCard deck={deck} />
            <PopularTechsCard deck={deck} />
          </Fragment>
        )}
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
  const { supertypeId, archetypeId, slug } = parseDeckUrlParams(params.deckId);

  const queryClient = new QueryClient();
  let deck: Deck | null | undefined;

  if (archetypeId) {
    deck = await fetchArchetype(archetypeId);
  } else if (supertypeId) {
    deck = await fetchSupertype(supertypeId);
  }

  if (!deck) return invalidDeckReturn;

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
      slug,
      dehydratedState: dehydrate(queryClient),
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
