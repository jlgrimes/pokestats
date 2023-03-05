import { Tournament } from '../../../../../types/tournament';
import { FinalTopCutView } from './FinalTopCutView';
import { LiveTopCutView } from './LiveTopCutView';

interface TopCutViewControllerProps {
  tournament: Tournament;
}

export const TopCutViewController = (props: TopCutViewControllerProps) => {
  if (props.tournament.tournamentStatus === 'running') {
    return <LiveTopCutView tournament={props.tournament} />;
  }

  if (props.tournament.tournamentStatus === 'finished')
    return <FinalTopCutView tournament={props.tournament} />;

  return null;
};
