import { useQuery } from '@tanstack/react-query';
import { PairingPlayer } from '../../types/pairings';
import { Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';

interface PlayerDecksFilters {
  tournamentId?: string;
  supertypeId?: number;
}

export const fetchPlayerDecks = async (filters: PlayerDecksFilters) => {
  let query = supabase
    .from('Player Decks')
    .select(
      `id,player_name,deck_archetype (
      id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    ),user_submitted_was_admin,user_who_submitted,on_stream`
    )
    .order('created_at', { ascending: false });

  if (filters.tournamentId) {
    query = query.eq('tournament_id', filters.tournamentId);
  }

  if (filters.supertypeId) {
    query = query.eq('deck_archetype.supertype', filters.supertypeId);
  }

  const res = await query;

  if (res.data) {
    return res.data.map(({ deck_archetype, ...rest }) => ({
      ...rest,
      deck_archetype: Array.isArray(deck_archetype)
        ? deck_archetype[0]
        : (deck_archetype as Deck),
    }));
  }

  return res.data;
};

interface PlayerDecksOptions {
  pairingPlayers?: PairingPlayer[];
  shouldDisableFetch?: boolean;
}

export const usePlayerDecks = (
  tournamentId: string,
  options?: PlayerDecksOptions
) => {
  const query = useQuery({
    queryKey: ['player-decks', tournamentId],
    queryFn: () => fetchPlayerDecks({ tournamentId }),
    enabled: !options?.shouldDisableFetch
  });

  const data = query.data ?? [];
  let playerDecks: Standing[];

  // TODO: Bring back pairings
  // if (options?.pairingPlayers) {
  //   playerDecks = options.pairingPlayers.map(player => ({
  //     ...player,
  //     placing: -1,
  //     deck_archetype: data.find(({ player_name }) => player_name === player.name)
  //       ?.deck_archetype as Deck,
  //   }));
  // } else {
  //   playerDecks = data.map(player => ({
  //     ...player,
  //     placing: -1,
  //     name: player.player_name,
  //     record: { wins: -1, ties: -1, losses: -1 },
  //   }));
  // }

  playerDecks = data.map(player => ({
    placing: -1,
    name: player.player_name,
    record: { wins: -1, ties: -1, losses: -1 },
    decklist: null,
    age_division: 'masters',
    defined_pokemon: [],
    identifiable_cards: [],
    deck_archetype: player.deck_archetype.id,
    supertype: player.deck_archetype.supertype,
    tournament_id: parseInt(tournamentId),
    tournament_name: null,
    tournament_date: null,
    day_two: null,
    tournament_status: null
  }));

  return {
    ...query,
    data: playerDecks,
  };
};
