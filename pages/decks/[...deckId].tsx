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
import { getFinalResultsDeckFilters } from '../../src/hooks/finalResults/useCardCounts';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { parseDeckUrlParams } from '../../src/lib/query-params';
import { Deck } from '../../types/tournament';
import { fetchFormats } from '../../src/hooks/formats/formats';
import { MatchupsCard } from '../../src/components/Deck/Analytics/MatchupsCard';
import supabase from '../../src/lib/supabase/client';

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
            {deck && <MatchupsCard deck={deck} />}
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

  const formats = await fetchFormats();
  const format = formats ? formats[formats.length - 1].id : null;

  await queryClient.setQueryData(['formats'], () => formats);

  const filter = getFinalResultsDeckFilters(
    {
      ...deck,
      classification: archetypeId ? 'archetype' : 'supertype',
    },
    format
  );

  await queryClient.prefetchQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments({ prefetch: true }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['code-to-set-map'],
    queryFn: () => fetchCodeToSetMap(),
  });

  if (deck.supertype) {
    await queryClient.prefetchQuery({
      queryKey: ['deck-variants', deck.supertype.id ?? null],
      queryFn: () => fetchVariants(deck!.supertype!.id),
    });
  }

  // const deckResultsFilters = getDeckResultsFilters(deck, format);
  // await queryClient.prefetchQuery({
  //   queryKey: ['deck-results', deckResultsFilters, false],
  //   queryFn: () => fetchDeckResults(deckResultsFilters, false),
  // });

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
  const decks = (await supabase.from('Deck Archetypes').select('id')).data ?? []

  return {
    paths: decks.map(({ id }) => ({
      params: {
        deckId: id,
      },
    })),
    fallback: 'blocking',
  };
}
