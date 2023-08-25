import { Stack, Icon } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
import { usePlayerLiveResults } from '../../../hooks/tournamentResults';
import {
  useSmartPlayerProfiles,
  useUserMatchesLoggedInUser,
} from '../../../hooks/user';
import { cropPlayerName } from '../../../lib/fetch/fetchLiveResults';
import { CommonCard } from '../../common/CommonCard';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';

interface PlayerTournamentViewProps {
  tournament: Tournament;
  playerName: string;
}

export const PlayerTournamentView = (props: PlayerTournamentViewProps) => {
  const { data } = useSmartPlayerProfiles({ name: props.playerName });
  const user = data?.at(0);

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
    playerName: user?.name,
    additionalNames: user?.additional_names,
    shouldLoadOpponentRounds: true
  });

  const playerFinalResult = finalResults?.at(0);

  // Masks a glitch where final results don't have opponent info for some reason
  const resultsData = playerFinalResult
    ? {
        isLoading: false,
        shouldHideDecks: false,
        player: playerFinalResult
      }
    : livePlayerResults;

  const isLoggedInUser = useUserMatchesLoggedInUser(user?.name);

  if (!props.tournament || !resultsData.player || !user) return null;

  return (
    <CommonCard ghost header='My tournament' leftIcon={<Icon color='blue.500' as={FaUser} />}>
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
    </CommonCard>
  );
};
