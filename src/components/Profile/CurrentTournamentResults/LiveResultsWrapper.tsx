import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import {
  useLiveTournamentPlayers,
  useLiveTournamentResults,
} from '../../../hooks/tournamentResults';
import { ComponentLoader } from '../../common/ComponentLoader';
import { MyTournamentView } from '../../Tournament/Home/MyTournamentView';
import { TournamentCard } from '../../TournamentList/TournamentCard';

interface LiveResultsWrapperProps {
  tournament: Tournament;
  playerName: string;
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
    <TournamentCard
      tournament={props.tournament}
      playerName={props.playerName}
    />
  );
};
