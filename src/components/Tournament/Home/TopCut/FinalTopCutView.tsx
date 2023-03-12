import { Badge, Icon, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { TopCutView } from './TopCutView';

interface TopCutViewProps {
  tournament: Tournament;
}

export const FinalTopCutView = (props: TopCutViewProps) => {
  const { data: finalTournamentResults, isLoading } = useFinalResults({
    tournamentId: props.tournament.id,
  });

  const topCutPlayers = useMemo(
    () => finalTournamentResults?.slice(0, 8),
    [finalTournamentResults]
  );

  return (
    <TopCutView
      tournament={props.tournament}
      players={topCutPlayers}
      isLoading={isLoading}
    />
  );
};
