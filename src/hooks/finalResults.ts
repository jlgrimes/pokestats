import { useQuery } from '@tanstack/react-query';
import { FinalResultsSchema } from '../../types/final-results';
import { Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { useArchetypes } from './deckArchetypes';

interface FinalResultsFilters {
  tournamentId?: number;
  deckId?: number;
  playerName?: string;
}

export const fetchFinalResults = async (
  deckArchetypes: Deck[] | null | undefined,
  filters?: FinalResultsFilters
): Promise<Standing[] | null | undefined> => {
  let query = supabase.from('Final Results').select('*');

  if (filters?.tournamentId)
    query = query.eq('tournament_id', filters.tournamentId);
  if (filters?.deckId) query = query.eq('deck_archetype', filters.deckId);
  if (filters?.playerName) query = query.eq('name', filters.playerName);

  const res = await query;
  const finalResultsData: FinalResultsSchema[] | null = res.data;

  return finalResultsData?.map(finalResult => {
    const deckArchetype = deckArchetypes?.find(
      ({ id }) => id === finalResult.deck_archetype
    );

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
