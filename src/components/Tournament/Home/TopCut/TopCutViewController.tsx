import { Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { FinalTopCutView } from './FinalTopCutView';
import { LiveTopCutView } from './LiveTopCutView';

interface TopCutViewControllerProps {
  tournament: Tournament;
}

export const TopCutViewController = (props: TopCutViewControllerProps) => {
  const { data: finalTournamentResults } = useFinalResults({
    tournamentId: props.tournament.id,
    minimumPlacing: 8
  });

  if (
    props.tournament.tournamentStatus === 'running' ||
    (props.tournament.tournamentStatus === 'finished' &&
      finalTournamentResults &&
      finalTournamentResults.length === 0)
  ) {
    return <LiveTopCutView tournament={props.tournament} />;
  }

  if (props.tournament.tournamentStatus === 'finished')
    return <FinalTopCutView tournament={props.tournament} />;

  return null;
};
