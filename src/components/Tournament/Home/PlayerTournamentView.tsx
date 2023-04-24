import { Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
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

  const { data: finalResults } = useFinalResults({
    tournamentId: props.tournament.id,
  });
  const playerFinalResult = finalResults?.find(
    standing =>
      standing.name === user?.name ||
      user?.additional_names?.includes(standing.name)
  );

  const resultsData = playerFinalResult
    ? {
        isLoading: false,
        shouldHideDecks: false,
        player: {
          ...playerFinalResult,
          rounds: playerFinalResult.rounds?.map(round => ({
            ...round,
            opponent: finalResults?.find(
              standing => standing.name === round.name
            ),
          })),
        },
      }
    : livePlayerResults;

  const isLoggedInUser = useUserMatchesLoggedInUser(user?.name);

  if (!props.tournament || !resultsData.player || !user) return null;

  return (
    <Stack spacing={3}>
      <PlayerMatchupStatus
        tournament={props.tournament}
        user={user}
        shouldHideOpponentView
        isLoggedInUser={isLoggedInUser}
        livePlayerResults={resultsData}
      />
      <MyMatchupsList
        tournament={props.tournament}
        user={user}
        isLoggedInUser={isLoggedInUser}
        livePlayerResults={resultsData}
      />
    </Stack>
  );
};
