import { useQuery } from '@tanstack/react-query';
import { FinalResultsSchema } from '../../types/final-results';
import { Deck, Standing } from '../../types/tournament';
import {
  fetchPlayerDecks,
  getPlayerDeckObjects,
} from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';
import { useArchetypes } from './deckArchetypes';

interface FinalResultsFilters {
  tournamentId?: string;
  deckId?: number;
  playerName?: string;
}

export const fetchDecksByPlayer = async (name: string) => {
  const res = await supabase
    .from('Player Decks')
    .select(
      `deck_archetype (
      id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    ),tournament_id`
    )
    .eq('player_name', name);
  return res.data;
};

export const fetchFinalResults = async (
  filters?: FinalResultsFilters
): Promise<Standing[] | null | undefined> => {
  let query = supabase.from('Final Results')
    .select(`name,placing,record,resistances,drop,rounds,tournament_id,deck_list,deck_archetype (
    id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    )`);

  if (filters?.tournamentId)
    query = query.eq('tournament_id', filters.tournamentId);
  if (filters?.deckId) query = query.eq('deck_archetype', filters.deckId);
  if (filters?.playerName) query = query.eq('name', filters.playerName);

  const res = await query;
  const finalResultsData: FinalResultsSchema[] | null = res.data;
  console.log(finalResultsData)

  let userReportedDecks: Deck[] | undefined | null = null;
  if (filters?.playerName) {
    const playerDecks = await fetchDecksByPlayer(filters.playerName);
    console.log(playerDecks);
    userReportedDecks = playerDecks;
  }

  return finalResultsData?.map(finalResult => {
    let deckArchetype;

    const userReportedDeck = userReportedDecks?.find(
      deck => finalResult.name === deck.name
    );
    if (userReportedDeck) {
      deckArchetype = userReportedDeck;
    }

    const confirmedArchetype = deckArchetypes?.find(
      ({ id }) => id === finalResult.deck_archetype
    );
    if (confirmedArchetype) {
      deckArchetype = confirmedArchetype;
    }

    if (!deckArchetype)
      return {
        ...finalResult,
        tournamentId: finalResult.tournament_id,
      };

    return {
      ...finalResult,
      tournamentId: finalResult.tournament_id,
      deck: {
        ...deckArchetype,
        ...(finalResult.deck_list ? { list: finalResult.deck_list } : {}),
      },
    };
  });
};

export const useFinalResults = (filters?: FinalResultsFilters) => {
  const { data: deckArchetypes } = useArchetypes();

  return useQuery({
    queryKey: ['final-results', ...Object.entries(filters ?? [])],
    queryFn: () => fetchFinalResults(deckArchetypes, filters),
  });
};
