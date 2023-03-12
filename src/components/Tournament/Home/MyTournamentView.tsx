import { Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { StoredPlayerProfile } from '../../../../types/player';
import { Tournament } from '../../../../types/tournament';
import { usePlayerLiveResults } from '../../../hooks/tournamentResults';
import { CommonCard } from '../../common/CommonCard';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';

interface MyTournamentViewProps {
  tournament: Tournament;
}

export const MyTournamentView = (props: MyTournamentViewProps) => {
  const session = useSession();
  const { player: playerResults, isLoading } = usePlayerLiveResults(
    props.tournament.id,
    session.data?.user?.name
  );

  if (!props.tournament || !playerResults) return null;

  return (
    <Stack spacing={6}>
      <PlayerMatchupStatus
        tournament={props.tournament}
        user={session.data?.user as StoredPlayerProfile}
        shouldHideOpponentView
      />
      <MyMatchupsList tournament={props.tournament} user={session.data?.user} />
    </Stack>
  );
};
