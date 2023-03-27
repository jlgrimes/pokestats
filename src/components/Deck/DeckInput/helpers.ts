import { CreateToastFnReturn } from '@chakra-ui/react';
import { Deck, Standing, Tournament } from '../../../../types/tournament';
import supabase from '../../../lib/supabase/client';

export const handleDeckSubmit = async (
  deck: Deck,
  existingDeck: Deck | undefined,
  selectedPlayer: string | undefined,
  sessionUserEmail: string | null | undefined,
  tournament: Tournament,
  isStreamDeck: boolean,
  userIsAdmin: boolean,
  toast: CreateToastFnReturn
) => {
  if (userIsAdmin && existingDeck?.id && selectedPlayer) {
    const res = await supabase
      .from('Player Decks')
      .select(`user_who_submitted`)
      .ilike('player_name', selectedPlayer)
      .eq('tournament_id', tournament.id)
      .order('created_at', { ascending: false });

    if (tournament.tournamentStatus === 'finished') {
      const supertype =
        deck.supertype?.id && deck.supertype.id >= 0 ? deck.supertype.id : null;

      const { error } = await supabase
        .from('Final Results')
        .update({ deck_archetype: deck.id, deck_supertype: supertype })
        .match({ name: selectedPlayer, tournament_id: tournament.id });

      if (error)
        return toast({
          status: 'error',
          title: error.message,
          description: error.details,
        });
    }

    const userReported = res.data && res.data.at(0)?.user_who_submitted;

    const { error } = await supabase.from('Shit List').insert({
      user_who_reported: userReported,
      reported_deck: existingDeck?.id,
      correct_deck: deck.id,
      tournament_id: tournament.id,
      reported_player: selectedPlayer
    });

    if (error) {
      return toast({
        status: 'error',
        title: error.message,
        description: error.details,
      });
    } else {
      toast({
        status: 'warning',
        title: 'Added ' + userReported + ' to the shit list',
      });
    }
  }

  const { error } = await supabase.from('Player Decks').insert({
    player_name: selectedPlayer,
    tournament_id: tournament.id,
    deck_archetype: deck.id,
    on_stream: isStreamDeck,
    user_who_submitted: sessionUserEmail,
    user_submitted_was_admin: userIsAdmin,
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
