import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { LoggedInPlayerStatus } from '../../../src/components/Tournament/Results/LoggedInPlayerStatus';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import {
  fetchCurrentTournamentInfo,
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';

export default function MyMatchups({ tournament }: { tournament: Tournament }) {
  const session = useSession();
  const router = useRouter();

  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: true },
  });

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push(`/tournaments/${tournament.id}/standings`);
    }
  }, [session]);

  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack spacing={6}>
        <LoggedInPlayerStatus
          tournament={tournament}
          tournamentFinished={!liveResults?.live}
        />
        <MyMatchupsList tournament={tournament} />
      </Stack>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const tournament = await fetchCurrentTournamentInfo(params.id, {
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
  const tournaments = await fetchTournaments({ prefetch: true });
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
