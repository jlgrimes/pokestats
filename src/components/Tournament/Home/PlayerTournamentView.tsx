import { Stack, Icon } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import {
  useSmartPlayerProfiles,
  useUserMatchesLoggedInUser,
} from '../../../hooks/user';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';
import { usePlayerStandings } from '../../../hooks/newStandings';
import { Card, Title } from '@tremor/react';

interface PlayerTournamentViewProps {
  tournament: Tournament;
  playerName: string;
}

export const PlayerTournamentView = (props: PlayerTournamentViewProps) => {
  const { data } = useSmartPlayerProfiles({ name: props.playerName });
  const user = data?.at(0);

  const { data: results } = usePlayerStandings(user, { tournament: props.tournament, shouldLoadOpponentRounds: true, shouldFilterOutDecksNotReportedByMe: props.tournament.tournamentStatus === 'running' });

  const result = results?.at(0);

  const isLoggedInUser = useUserMatchesLoggedInUser(user?.name);

  if (!props.tournament || !results || !user || !result) return null;

  return (
    <Card className='px-0'>
      {/* <Title className='m-6'>My tournament</Title> */}
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
    </Card>
  )
};
