import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchCards } from '../../src/hooks/cards';

export default function CardPage() {
  return <div>yo</div>;
}

export async function getStaticProps({
  params,
}: {
  params: {
    cardId: string;
  };
}) {
  const splitQueryParam = params.cardId.split('-');
  const name = splitQueryParam.slice(0, splitQueryParam.length - 1).join(' ');
  const set = splitQueryParam.at(splitQueryParam.length - 1) ?? '';

  const results = await fetchCards(name, set);

  const queryClient = new QueryClient();

  // const deck = await fetchArchetype(deckId);
  // await queryClient.prefetchQuery({
  //   queryKey: ['tournaments'],
  //   queryFn: () => fetchTournaments({ prefetch: true }),
  // });
  // await queryClient.prefetchQuery({
  //   queryKey: [
  //     'final-results',
  //     {
  //       deckId,
  //     },
  //   ],
  //   queryFn: () => fetchFinalResults({ deckId }),
  // });
  // await queryClient.prefetchQuery({
  //   queryKey: ['code-to-set-map'],
  //   queryFn: () => fetchCodeToSetMap(),
  // });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  return {
    paths: ['/cards/pikachu'],
    fallback: true,
  };
}
