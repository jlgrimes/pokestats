import { Stack, Table, TableContainer, Tbody } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { ResultsHeader } from '../../../src/components/Tournament/Results/ResultsList/ResultsHeader';
import { ResultsRow } from '../../../src/components/Tournament/Results/ResultsList/ResultsRow';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useUserIsAdmin } from '../../../src/hooks/administrators';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import supabase from '../../../src/lib/supabase/client';
import { MatchupResult } from '../../../types/tournament';

export default function MyMatchups({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const session = useSession();
  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: true },
  });

  const player = liveResults?.data?.find(
    player => player.name === session.data?.user.name
  );
  const opponents: (MatchupResult | undefined)[] = Object.values(
    player?.rounds ?? {}
  )?.map(opponent => {
    const opponentResult = liveResults?.data.find(
      player => player.name === opponent.name
    );
    
    if (opponentResult) {
      return {
        ...opponentResult,
        result: opponent.result
      };
    }

    return;
  });

  const roundsArr = Object.values(player?.rounds ?? {});

  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack padding='1rem 1.5rem'>
        {roundsArr.length > 0 && (
          <MyMatchupsList tournament={tournament} />
        )}
      </Stack>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [`live-results-${params.id}`, 'roundData'],
    () =>
      fetchLiveResults(params.id, { prefetch: true, load: { roundData: true } })
  );

  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');

  return {
    props: {
      tournament: {
        id: params.id,
        name: tournaments?.find(({ id }) => id === params.id)?.name,
      },
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');
  const paths = tournaments?.map(tournament => ({
    params: {
      id: tournament.id,
      displayName: tournament.name,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}
