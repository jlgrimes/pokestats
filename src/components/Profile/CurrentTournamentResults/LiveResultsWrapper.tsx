import { Box, Stack } from '@chakra-ui/react';
import { CombinedPlayerProfile } from '../../../../types/player';
import { Tournament } from '../../../../types/tournament';
import {
  useLiveTournamentPlayers,
  useLiveTournamentResults,
} from '../../../hooks/tournamentResults';
import { CommonCard } from '../../common/CommonCard';
import { ComponentLoader } from '../../common/ComponentLoader';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { MyTournamentView } from '../../Tournament/Home/MyTournamentView';
import { TournamentCard } from '../../TournamentList/TournamentCard';
import { TournamentInfo } from '../../TournamentList/TournamentInfo';

interface LiveResultsWrapperProps {
  tournament: Tournament;
  user: CombinedPlayerProfile;
  isLoggedInUser: boolean;
}

export const LiveResultsWrapper = (props: LiveResultsWrapperProps) => {
  const { isLoading, data } = useLiveTournamentResults(props.tournament.id, {
    load: { allRoundData: true },
  });

  const playerInLiveTournament = data?.data.find(
    standing =>
      standing.name === props.user.name ||
      props.user.additional_names?.includes(standing.name)
  );

  if (isLoading) return <ComponentLoader />;
  if (!playerInLiveTournament) return null;

  return (
    <Stack>
      <TournamentInfo tournament={props.tournament} />
      <MyTournamentView
        tournament={props.tournament}
        playerName={playerInLiveTournament.name}
      />
    </Stack>
    // <TournamentCard
    //   tournament={props.tournament}
    //   playerName={props.playerName}
    //   disableFollowing
    // />
  );
};
