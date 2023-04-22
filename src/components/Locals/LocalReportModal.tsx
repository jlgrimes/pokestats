import { useDisclosure, UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { Fragment, useState } from 'react';
import { Deck, Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import { LocalTournament } from '../../hooks/locals';
import { usePlayerDecks } from '../../hooks/playerDecks';
import { useLiveTournamentPlayers } from '../../hooks/tournamentResults';
import supabase from '../../lib/supabase/client';
import { ArchetypeSelectorModal } from '../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import { handleDeckSubmit } from '../Deck/DeckInput/helpers';
import { PlayerSelectModal } from '../Tournament/Home/PinnedPlayers/PlayerSelectModal';

interface LocalReportModalProps {
  tournament: LocalTournament;
  modalControls: UseDisclosureProps;
  playerName: string;
}

export const LocalReportModal = (props: LocalReportModalProps) => {
  const toast = useToast();

  const handleDeckSelect = async (deck: Deck) => {
    const res = await supabase.from('Local Player Decks').insert({
      tournament_id: props.tournament.id,
      player_name: props.playerName,
      deck_archetype: deck.id,
    });

    if (res.error) {
      return toast({
        status: 'error',
        title: res.error.message,
      });
    }

    return toast({
      status: 'success',
      title: 'Successfully submitted',
    });
  };

  return (
    <Fragment>
      {props.modalControls.isOpen && (
        <Fragment>
          <ArchetypeSelectorModal
            onChange={handleDeckSelect}
            tournament={undefined}
            modalControls={props.modalControls}
            userIsAdmin={true}
            isListUp={false}
            isStreamDeck={false}
            toggleIsStreamDeck={() => {}}
            isLocal
          />
        </Fragment>
      )}
    </Fragment>
  );
};
