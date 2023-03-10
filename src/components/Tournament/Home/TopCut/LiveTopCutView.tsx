import { useMemo } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { TopCutView } from './TopCutView';

interface TopCutViewProps {
  tournament: Tournament;
}

export const LiveTopCutView = (props: TopCutViewProps) => {
  const { data: liveTournamentResults, isLoading } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );

  const topCutPlayers = useMemo(
    () => liveTournamentResults?.data.slice(0, 8),
    [liveTournamentResults?.data]
  );

  return (
    <TopCutView
      tournament={props.tournament}
      players={topCutPlayers}
      isLoading={isLoading}
    />
  );
};
