import { useDisclosure, UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { usePlayerDecks } from '../../../hooks/playerDecks';
import { useLiveTournamentPlayers } from '../../../hooks/tournamentResults';
import supabase from '../../../lib/supabase/client';
import { ArchetypeSelectorModal } from '../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import { PlayerSelectModal } from './PinnedPlayers/PlayerSelectModal';

interface ReportModalProps {
  tournament: Tournament;
  playerSelectModalControls: UseDisclosureProps;
}

export const ReportModal = (props: ReportModalProps) => {
  const session = useSession();
  const toast = useToast();
  const { data: playerDecks } = usePlayerDecks(props.tournament.id);

  const { data: playerNames } = useLiveTournamentPlayers(props.tournament.id);

  const [selectedPlayer, setSelectedPlayer] = useState<string | undefined>();
  const [isStreamDeck, setIsStreamDeck] = useState(false);

  const archetypeModalControls = useDisclosure();

  const handlePlayerSelect = (name: string) => {
    setSelectedPlayer(name);
    props.playerSelectModalControls.onClose &&
      props.playerSelectModalControls.onClose();

    archetypeModalControls.onOpen();
  };

  const handleDeckSelect = async (deck: Deck) => {
    setIsStreamDeck(false);

    if (playerDecks.find(playerDeck => playerDeck.name === selectedPlayer)) {
      const { error } = await supabase
        .from('Player Decks')
        .update({ deck_archetype: deck.id, on_stream: isStreamDeck })
        .match({
          player_name: selectedPlayer,
          tournament_id: props.tournament.id,
        });
      if (error) {
        return toast({
          status: 'error',
          title: `Error updating deck for ${selectedPlayer}`,
          description: error.message,
        });
      }

      return toast({
        status: 'success',
        title: `Submitted deck for ${selectedPlayer}`,
      });
    } else {
      const { error } = await supabase.from('Player Decks').insert({
        player_name: selectedPlayer,
        tournament_id: props.tournament.id,
        deck_archetype: deck.id,
        on_stream: isStreamDeck,
        user_who_submitted: session.data?.user?.email,
        user_submitted_was_admin: true,
      });
      if (error) {
        return toast({
          status: 'error',
          title: `Error adding deck for ${selectedPlayer}`,
          description: error.message,
        });
      }

      return toast({
        status: 'success',
        title: `Submitted deck for ${selectedPlayer}`,
      });
    }
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
            userIsAdmin={true}
            isListUp={false}
            isStreamDeck={isStreamDeck}
            toggleIsStreamDeck={() => setIsStreamDeck(!isStreamDeck)}
          />
        </Fragment>
      )}
    </Fragment>
  );
};
