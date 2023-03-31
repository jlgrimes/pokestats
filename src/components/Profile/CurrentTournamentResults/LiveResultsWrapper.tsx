import { Box, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import {
  useLiveTournamentPlayers,
  useLiveTournamentResults,
} from '../../../hooks/tournamentResults';
import { reallyShortenTournamentName } from '../../../lib/tournament';
import { CommonCard } from '../../common/CommonCard';
import { ComponentLoader } from '../../common/ComponentLoader';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { MyTournamentView } from '../../Tournament/Home/MyTournamentView';
import { TournamentCard } from '../../TournamentList/TournamentCard';

interface LiveResultsWrapperProps {
  tournament: Tournament;
  playerName: string;
  isLoggedInUser: boolean;
}

export const LiveResultsWrapper = (props: LiveResultsWrapperProps) => {
  const { isLoading, data } = useLiveTournamentResults(props.tournament.id, {
    load: { allRoundData: true },
  });

  const playerIsInLiveTournament = data?.data.find(
    standing => standing.name === props.playerName
  );

  if (isLoading) return <ComponentLoader />;
  if (!playerIsInLiveTournament) return null;

  return (
    <Box px={3} py={2}>
      <CommonCard header={reallyShortenTournamentName(props.tournament)}>
        <MyTournamentView
          tournament={props.tournament}
          playerName={props.playerName}
        />
      </CommonCard>
    </Box>
    // <TournamentCard
    //   tournament={props.tournament}
    //   playerName={props.playerName}
    //   disableFollowing
    // />
  );
};
