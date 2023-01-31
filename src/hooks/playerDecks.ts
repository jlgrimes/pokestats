import { useQuery } from '@tanstack/react-query';
import { PairingPlayer } from '../../types/pairings';
import { Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';

export const fetchPlayerDecks = async (tournamentId: string) => {
  const res = await supabase
    .from('Player Decks')
    .select(
      `id,player_name,deck_archetype (
      id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    ),user_submitted_was_admin,on_stream`
    )
    .eq('tournament_id', tournamentId);
  return res.data;
};

interface PlayerDecksOptions {
  pairingPlayers?: PairingPlayer[];
}

export const usePlayerDecks = (
  tournamentId: string,
  options?: PlayerDecksOptions
) => {
  const query = useQuery({
    queryKey: ['player-decks', tournamentId],
    queryFn: () => fetchPlayerDecks(tournamentId),
  });

  const data = query.data ?? [];
  let playerDecks: Standing[];

  if (options?.pairingPlayers) {
    playerDecks = options.pairingPlayers.map(player => ({
      ...player,
      placing: -1,
      deck: data.find(({ player_name }) => player_name === player.name)
        ?.deck_archetype as Deck,
    }));
  } else {
    playerDecks = data.map(player => ({
      ...player,
      placing: -1,
      name: player.player_name,
      record: { wins: -1, ties: -1, losses: -1 },
    }));
  }

  return {
    ...query,
    data: playerDecks,
  };
};
