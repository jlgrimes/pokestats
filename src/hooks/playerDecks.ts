import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchPlayerDecks = async (tournamentId: string) => {
  const res = await supabase
    .from('Player Decks')
    .select('id,player_name,deck_archetype,user_submitted_was_admin,on_stream')
    .eq('tournament_id', tournamentId);
  return res.data;
};

interface PlayerDecksOptions {
  playerNames?: string[];
}

export const usePlayerDecks = (
  tournamentId: string,
  options?: PlayerDecksOptions
) => {
  const query = useQuery({
    queryKey: ['player-decks', tournamentId],
    queryFn: () => fetchPlayerDecks(tournamentId),
  });
  const data = query.data
    ? options?.playerNames
      ? query.data.filter(({ player_name }) =>
          options.playerNames?.includes(player_name)
        )
      : query.data
    : [];

  return {
    ...query,
    data: data.map((player) => ({
      ...player,
      name: player.player_name,
      deck: player.deck_archetype,
      record: { wins: -1, losses: -1, ties: -1}
    })),
  };
};
