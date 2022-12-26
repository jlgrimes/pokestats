import { Stack, Table, TableContainer } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ResultsHeader } from '../../../src/components/Tournament/Results/ResultsList/ResultsHeader';
import { ResultsRow } from '../../../src/components/Tournament/Results/ResultsList/ResultsRow';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import supabase from '../../../src/lib/supabase/client';

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
  const opponents = Object.values(player?.rounds ?? {})?.map(opponent => {
    const opponentResult = liveResults?.data.find(
      player => player.name === opponent.name
    );
  });

  return (
    <Stack padding='1.5rem'>
      <Table>
        <TableContainer>
          <ResultsHeader view='matchups' />
          {Object.values(player?.rounds ?? {})?.map((round, idx) => (
            <ResultsRow
              key={idx}
              view='matchups'
              result={{
                currentMatchResult: round?.result,
              }}
              tournament={tournament}
              allowEdits={true}
              tournamentFinished={!liveResults?.live}
            />
          ))}
        </TableContainer>
      </Table>
    </Stack>
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
