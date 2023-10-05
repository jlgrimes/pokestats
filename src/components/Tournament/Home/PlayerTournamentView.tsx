import { Stack, Icon } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import {
  useSmartPlayerProfiles,
  useUserMatchesLoggedInUser,
} from '../../../hooks/user';
import { cropPlayerName } from '../../../lib/fetch/fetchLiveResults';
import { CommonCard } from '../../common/CommonCard';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';
import { usePlayerStandings } from '../../../hooks/newStandings';

interface PlayerTournamentViewProps {
  tournament: Tournament;
  playerName: string;
}

export const PlayerTournamentView = (props: PlayerTournamentViewProps) => {
  const { data } = useSmartPlayerProfiles({ name: props.playerName });
  const user = data?.at(0);

  const { data: results } = usePlayerStandings(user, { tournament: props.tournament, shouldLoadOpponentRounds: true })

  const result = results?.at(0);

  const isLoggedInUser = useUserMatchesLoggedInUser(user?.name);

  if (!props.tournament || !results || !user) return null;

  return (
    <CommonCard ghost header='My tournament' leftIcon={<Icon color='blue.500' as={FaUser} />}>
      <Stack spacing={3}>
        <PlayerMatchupStatus
          tournament={props.tournament}
          user={user}
          shouldHideOpponentView
          isLoggedInUser={isLoggedInUser}
          myStanding={result}
        />
        <MyMatchupsList
          tournament={props.tournament}
          user={user}
          isLoggedInUser={isLoggedInUser}
          myStanding={result}
        />
      </Stack>
    </CommonCard>
  );
};
