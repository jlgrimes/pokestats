import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { DeckAnalyticsContainer } from '../../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckVariants } from '../../../src/components/Deck/Analytics/DeckVariants';
import { PopularTechsCard } from '../../../src/components/Deck/Analytics/PopularTechsCard';
import { RecentFinishesCard } from '../../../src/components/Deck/Analytics/RecentFinishesCard';
import {
  fetchArchetype,
  fetchVariants,
} from '../../../src/hooks/deckArchetypes';
import { fetchCodeToSetMap } from '../../../src/hooks/deckList';
import {
  fetchFinalResults,
  fetchUniqueDecks,
} from '../../../src/hooks/finalResults';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { Deck } from '../../../types/tournament';

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

export async function getStaticProps({ slug }: { slug: string[] }) {
  const deckId = parseInt(slug[0]);
  const queryClient = new QueryClient();

  const deck = await fetchArchetype(deckId);
  await queryClient.prefetchQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments({ prefetch: true }),
  });
  await queryClient.prefetchQuery({
    queryKey: [
      'final-results',
      {
        deckId,
      },
    ],
    queryFn: () => fetchFinalResults({ deckId }),
  });
  await queryClient.prefetchQuery({
    queryKey: ['deck-variants', deck?.supertype],
    queryFn: () => fetchVariants(deck?.supertype),
  });
  await queryClient.prefetchQuery({
    queryKey: ['code-to-set-map'],
    queryFn: () => fetchCodeToSetMap(),
  });

  return {
    props: {
      deck,
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
