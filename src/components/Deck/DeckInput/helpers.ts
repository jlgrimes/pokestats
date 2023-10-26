import { CreateToastFnReturn } from '@chakra-ui/react';
import { Deck, Standing, Tournament } from '../../../../types/tournament';
import supabase from '../../../lib/supabase/client';

export const handleDeckSubmit = async (
  newDeck: Deck,
  standing: Standing,
  sessionUserEmail: string | null | undefined,
  tournament: Tournament,
  userIsAdmin: boolean,
  toast: CreateToastFnReturn
) => {
  if (userIsAdmin && standing.deck_archetype && standing.name) {
    const res = await supabase
      .from('Player Decks')
      .select(`user_who_submitted,user_submitted_was_admin`)
      .ilike('player_name', standing.name)
      .eq('tournament_id', tournament.id)
      .order('created_at', { ascending: false });

    if (res.data && res.data[0].user_submitted_was_admin) {
      return toast({
        status: 'info',
        title: 'You are overriding an admin report. Cool!',
      });
    }

    const userReported = res.data && res.data[0]?.user_who_submitted;

    if (!userReported) {
      return toast({
        status: 'error',
        title: `User reported is ${userReported}`,
        description: 'Cannot submit to shit list.',
      });
    }

    const { error } = await supabase.from('Shit List').insert({
      user_who_reported: userReported,
      reported_deck: newDeck.id,
      correct_deck: standing.deck_archetype,
      tournament_id: tournament.id,
      reported_player: standing.name,
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
    player_name: standing.name,
    tournament_id: tournament.id,
    deck_archetype: newDeck.id,
    user_who_submitted: sessionUserEmail,
    user_submitted_was_admin: userIsAdmin,
  });
  if (error) {
    return toast({
      status: 'error',
      title: `Error adding deck for ${standing.name}`,
      description: error.message,
    });
  }

  return toast({
    status: 'success',
    title: `Submitted deck for ${standing.name}`,
  });
};
