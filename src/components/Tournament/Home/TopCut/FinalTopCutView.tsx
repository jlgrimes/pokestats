import { useMemo } from 'react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { TopCutView } from './TopCutView';

interface TopCutViewProps {
  tournament: Tournament;
}

export const FinalTopCutView = (props: TopCutViewProps) => {
  const { data: finalTournamentResults, isLoading } = useFinalResults({
    tournamentId: props.tournament.id,
    minimumPlacing: 8
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
