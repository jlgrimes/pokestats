import { Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MetaGameShareList } from '../../../src/components/Deck/Analytics/MetaGameShare/MetaGameShareList';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';

export default function DecksPage({ tournament }: { tournament: Tournament }) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack paddingX={4}>
        <Heading size={'md'}>Day 2 Metagame</Heading>
        <MetaGameShareList tournament={tournament} sortByMoves={false} />
      </Stack>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });
  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    excludeUpcoming: true,
  });
  const paths = tournaments?.map(tournament => {
    return {
      params: {
        id: tournament.id,
        displayName: tournament.name,
      },
    };
  });

  let pathsWithDivisions: any[] = [];
  for (const division of ['masters', 'seniors', 'juniors']) {
    pathsWithDivisions = [...pathsWithDivisions, ...paths.map((path) => ({ params: { ...path.params, division }}))]
  }

  return {
    paths: pathsWithDivisions,
    fallback: 'blocking',
  };
}
