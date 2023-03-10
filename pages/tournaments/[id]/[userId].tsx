import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../../../src/components/Tournament/Results/PlayerMatchupStatus';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { fetchUser } from '../../../src/hooks/user';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';
import { StoredPlayerProfile } from '../../../types/player';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { fetchPokedex } from '../../../src/hooks/images';
import { parseUsername } from '../../../src/lib/strings';
import { fetchVerifiedUserTournaments } from '../../../src/hooks/finalResults/fetch';

export default function UserMatchups({
  tournament,
  user,
}: {
  tournament: Tournament;
  user: StoredPlayerProfile;
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack spacing={6}>
        <PlayerMatchupStatus tournament={tournament} user={user} />
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
  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });
  queryClient.setQueryData(['tournaments', params.id], () => tournament);

  await queryClient.prefetchQuery(
    [`live-results`, params.id, 'allRoundData', true],
    () =>
      fetchLiveResults(params.id, {
        prefetch: true,
        load: { allRoundData: true },
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
