import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { LoggedInPlayerStatus } from '../../../src/components/Tournament/Results/LoggedInPlayerStatus';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { fetchPokedex } from '../../../src/hooks/images';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import {
  fetchCurrentTournamentInfo,
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import {
  fetchLiveResults,
  fetchPlayerDecks,
} from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';

export default function MyMatchups({
  tournament,
  session,
}: {
  tournament: Tournament;
  session: { data: Session; status: string };
}) {
  const router = useRouter();

  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: true },
  });

  useEffect(() => {
    if (session?.status === 'unauthenticated') {
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const queryClient = new QueryClient();
  const tournament = await fetchCurrentTournamentInfo(context.query.id, {
    prefetch: true,
  });
  await queryClient.prefetchQuery(
    [`live-results`, context.query.id, 'roundData'],
    () =>
      fetchLiveResults(context.query.id, {
        prefetch: true,
        load: { roundData: true },
      })
  );

  return {
    props: {
      tournament,
      session,
      dehydratedState: dehydrate(queryClient),
    },
  };
}
