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

interface PlayerTournamentViewProps {
  tournament: Tournament;
  playerName: string;
}

export const PlayerTournamentView = (props: PlayerTournamentViewProps) => {
  const { data: user } = usePlayerProfile({ name: props.playerName });
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
