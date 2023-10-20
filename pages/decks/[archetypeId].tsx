import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { CardCounts } from '../../src/components/Deck/Analytics/CardCounts/CardCounts';
import { DeckAnalyticsContainer } from '../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckFinishes } from '../../src/components/Deck/Analytics/DeckFinishes';
import { PopularTechsCard } from '../../src/components/Deck/Analytics/PopularTechsCard';
import { RecentFinishesCard } from '../../src/components/Deck/Analytics/RecentFinishesCard';
import {
  fetchArchetype,
  fetchVariants,
} from '../../src/hooks/deckArchetypes';
import { fetchCodeToSetMap } from '../../src/hooks/deckList';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Deck } from '../../types/tournament';
import { fetchFormats } from '../../src/hooks/formats/formats';
import { MatchupsCard } from '../../src/components/Deck/Analytics/MatchupsCard';
import supabase from '../../src/lib/supabase/client';

export default function DeckPage({
  deck,
}: {
  deck: Deck;
}) {
  return (
    <DeckAnalyticsContainer deck={deck}>
      <Fragment>
      <RecentFinishesCard deck={deck} />
      {deck && <MatchupsCard deck={deck} />}
      {/* <PopularTechsCard deck={deck} /> */}
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
  params: { archetypeId: string };
}) {
  const queryClient = new QueryClient();
  let deck: Deck | null | undefined = await fetchArchetype(parseInt(params.archetypeId));

  if (!deck) return invalidDeckReturn;

  const formats = await fetchFormats();
  const format = formats ? formats[formats.length - 1].id : null;

  await queryClient.setQueryData(['formats'], () => formats);

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
      deck,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const decksRes = await supabase.from('Deck Archetypes').select('id');
  const decks = decksRes.data ?? [];

  return {
    paths: decks.map(({ id }) => ({
      params: {
        archetypeId: id.toString(),
      },
    })),
    fallback: 'blocking',
  };
}
