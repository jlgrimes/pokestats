import { Fragment } from 'react';
import { DeckAnalyticsContainer } from '../../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { DeckVariants } from '../../../src/components/Deck/Analytics/DeckVariants';
import { PopularTechsCard } from '../../../src/components/Deck/Analytics/PopularTechsCard';
import { RecentFinishesCard } from '../../../src/components/Deck/Analytics/RecentFinishesCard';
import { fetchArchetype } from '../../../src/hooks/deckArchetypes';
import { fetchUniqueDecks } from '../../../src/hooks/finalResults';
import { Deck } from '../../../types/tournament';

export default function DeckPage({ deck }: { deck: Deck }) {
  return (
    <DeckAnalyticsContainer deck={deck}>
      <Fragment>
        <DeckVariants deck={deck} />
        <RecentFinishesCard deck={deck} />
        <PopularTechsCard deck={deck} />
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
