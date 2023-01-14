import { Stack, Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../../../src/components/Tournament/Results/PlayerMatchupStatus';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchCurrentTournamentInfo } from '../../../src/hooks/tournaments';
import { fetchAllVerifiedUsers, fetchUser } from '../../../src/hooks/user';
import {
  fetchLiveResults,
  fetchPlayerDecks,
} from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';
import { StoredPlayerProfile } from '../../../types/player';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { fetchPokedex } from '../../../src/hooks/images';
import { parseUsername } from '../../../src/lib/strings';
import { fetchVerifiedUserTournaments } from '../../../src/hooks/finalResults';

export default function UserMatchups({
  tournament,
  user,
}: {
  tournament: Tournament;
  user: StoredPlayerProfile;
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: user.name },
  });

  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack spacing={6}>
        <PlayerMatchupStatus
          tournament={tournament}
          user={user}
          tournamentFinished={liveResults?.tournamentStatus === 'finished'}
        />
        <MyMatchupsList tournament={tournament} user={user} />
      </Stack>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: {
    id: string;
    userId: string;
  };
}) {
  const user = (await fetchUser(`${params.userId}@gmail.com`)) ?? null;
  const queryClient = new QueryClient();
  const tournament = await fetchCurrentTournamentInfo(params.id, {
    prefetch: true,
  });
  await queryClient.prefetchQuery(
    [`live-results`, params.id, 'roundData', user?.name],
    () =>
      fetchLiveResults(params.id, {
        prefetch: true,
        load: { roundData: user?.name },
      })
  );
  await queryClient.prefetchQuery(['deck-archetypes'], () => fetchArchetypes());
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);

  return {
    props: {
      tournament,
      user: user,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const users = await fetchVerifiedUserTournaments();

  const paths = users?.reduce(
    (
      acc: { params: { id: string; userId: string } }[],
      user: { name: string; tournament_id: string; email: string }
    ) => {
      return [
        ...acc,
        {
          params: {
            id: user.tournament_id,
            userId: parseUsername(user.email),
          },
        },
      ];
    },
    []
  );

  return {
    paths,
    fallback: 'blocking',
  };
}
