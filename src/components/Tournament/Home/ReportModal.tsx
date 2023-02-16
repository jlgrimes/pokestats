import { useDisclosure, UseDisclosureProps } from '@chakra-ui/react';
import { Fragment, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useLiveTournamentPlayers } from '../../../hooks/tournamentResults';
import { ArchetypeSelectorModal } from '../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import { PlayerSelectModal } from './PinnedPlayers/PlayerSelectModal';

interface ReportModalProps {
  tournament: Tournament;
  playerSelectModalControls: UseDisclosureProps;
}

export const ReportModal = (props: ReportModalProps) => {
  const { data: playerNames } = useLiveTournamentPlayers(props.tournament.id);
  const { data: userIsAdmin } = useUserIsAdmin();

  const [selectedPlayer, setSelectedPlayer] = useState<string | undefined>();
  const archetypeModalControls = useDisclosure();

  const handlePlayerSelect = (name: string) => {
    setSelectedPlayer(name);
    props.playerSelectModalControls.onClose &&
      props.playerSelectModalControls.onClose();

    archetypeModalControls.onOpen();
  };

  const handleDeckSelect = (deck: Deck) => {
    console.log(selectedPlayer, deck);
  };

  return (
    <Fragment>
      {(props.playerSelectModalControls.isOpen ||
        archetypeModalControls.isOpen) && (
        <Fragment>
          <PlayerSelectModal
            tournament={props.tournament}
            modalControls={props.playerSelectModalControls}
            playerNames={playerNames ?? []}
            handleSubmit={handlePlayerSelect}
          />
          <ArchetypeSelectorModal
            onChange={handleDeckSelect}
            tournamentId={props.tournament.id}
            modalControls={archetypeModalControls}
            userIsAdmin={userIsAdmin}
            isListUp={false}
          />
        </Fragment>
      )}
    </Fragment>
  );
};
