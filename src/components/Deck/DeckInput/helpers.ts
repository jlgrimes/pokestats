import { CreateToastFnReturn } from '@chakra-ui/react';
import { Deck, Standing } from '../../../../types/tournament';
import supabase from '../../../lib/supabase/client';

export const handleDeckSubmit = async (
  deck: Deck,
  existingDeck: Deck | undefined,
  selectedPlayer: string | undefined,
  sessionUserEmail: string | null | undefined,
  tournamentId: string,
  isStreamDeck: boolean,
  userIsAdmin: boolean,
  toast: CreateToastFnReturn
) => {
  if (userIsAdmin && existingDeck?.id) {
    const { error } = await supabase.from('Shit List').insert({
      user_who_reported: deck.user_who_submitted,
      reported_deck: existingDeck?.id,
      correct_deck: deck.id,
    });

    if (error) {
      toast({
        status: 'error',
        title: error.message,
        description: error.details,
      });
    } else {
      toast({
        status: 'warning',
        title: 'Added ' + deck.user_who_submitted + ' to the shit list',
      });
    }
  }

  const { error } = await supabase.from('Player Decks').insert({
    player_name: selectedPlayer,
    tournament_id: tournamentId,
    deck_archetype: deck.id,
    on_stream: isStreamDeck,
    user_who_submitted: sessionUserEmail,
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
};
