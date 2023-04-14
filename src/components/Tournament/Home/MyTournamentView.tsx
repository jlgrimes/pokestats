import { Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Tournament } from '../../../../types/tournament';
import { usePlayerLiveResults } from '../../../hooks/tournamentResults';
import {
  usePlayerProfile,
  useUserMatchesLoggedInUser,
} from '../../../hooks/user';
import { CommonCard } from '../../common/CommonCard';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';

interface MyTournamentViewProps {
  tournament: Tournament;
}

export const MyTournamentView = (props: MyTournamentViewProps) => {
  const session = useSession();
  const { data: user } = usePlayerProfile({ name: session.data?.user?.name });
  const livePlayerResults = usePlayerLiveResults(
    props.tournament.id,
    user?.name,
    {
      load: { opponentRoundData: true },
      additionalNames: user?.additional_names,
    }
  );

  const isLoggedInUser = useUserMatchesLoggedInUser(user?.name);

  if (!props.tournament || !livePlayerResults.player || !user) return null;

  return (
    <Stack spacing={3}>
      <PlayerMatchupStatus
        tournament={props.tournament}
        user={user}
        shouldHideOpponentView
        isLoggedInUser={isLoggedInUser}
        livePlayerResults={livePlayerResults}
      />
      <MyMatchupsList
        tournament={props.tournament}
        user={user}
        isLoggedInUser={isLoggedInUser}
        livePlayerResults={livePlayerResults}
      />
    </Stack>
  );
};
