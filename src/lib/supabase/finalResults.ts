import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';

export const loadFinalResults = async (tournamentId: string) => {
  const { data: finalResultsData } = await supabase
    .from('Final Results')
    .select('id')
    .eq('tournament_id', tournamentId);

  // We've already inserted final results for this tournament.
  if (finalResultsData && finalResultsData.length > 0) return;

  const { tournamentStatus, data: playerData } = await fetchLiveResults(
    tournamentId,
    {
      load: { allRoundData: true },
      prefetch: true,
    }
  );

  // If the tournament is still ongoing
  if (tournamentStatus !== 'finished') return;

  // Fire away!
  const rowsToBeInserted = playerData.map((player) => ({
    tournament_id: tournamentId,
    name: player.name,
    placing: player.placing,
    record: player.record,
    resistances: player.resistances,
    deck_list: player.deck.list,
    rounds: player.rounds
  }))

  // const result = await supabase
  //   .from('Final Results')
  //   .insert([{ name, defined_pokemon: [pokemon1, pokemon2] }]);
  // return result;

  return;
};
