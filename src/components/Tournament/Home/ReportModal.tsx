import { useDisclosure, UseDisclosureProps } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Tournament } from '../../../../types/tournament';
import { useLiveTournamentPlayers } from '../../../hooks/tournamentResults';
import { PlayerSelectModal } from './PinnedPlayers/PlayerSelectModal';

interface ReportModalProps {
  tournament: Tournament;
  playerSelectModalControls: UseDisclosureProps;
}

export const ReportModal = (props: ReportModalProps) => {
  const { data: playerNames } = useLiveTournamentPlayers(props.tournament.id);

  const handlePlayerSelect = () => {
    props.playerSelectModalControls.onClose &&
      props.playerSelectModalControls.onClose();
  };

  return (
    <Fragment>
      <PlayerSelectModal
        tournament={props.tournament}
        modalControls={props.playerSelectModalControls}
        playerNames={playerNames ?? []}
        handleSubmit={handlePlayerSelect}
      />
    </Fragment>
  );
};
