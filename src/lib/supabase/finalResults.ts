import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';

export const loadFinalResults = async (tournamentId: string) => {
  const { data: finalResultsData } = await supabase
    .from('Final Results')
    .select('id')
    .eq('tournament_id', tournamentId);

  // We've already inserted final results for this tournament.
  if (finalResultsData && finalResultsData.length > 0) {
    console.log('We already inserted the results. Cancelling...');
    return { error: null };
  }

  const { tournamentStatus, data: playerData } = await fetchLiveResults(
    tournamentId,
    {
      load: { allRoundData: true },
      prefetch: true,
    }
  );

  // If the tournament is still ongoing
  if (tournamentStatus !== 'finished') {
    console.log('Tournament is not done. Cancelling...');
    return { error: null };
  }

  // Fire away!
  const rowsToBeInserted = playerData.map(player => ({
    tournament_id: tournamentId,
    name: player.name,
    placing: player.placing,
    record: player.record,
    resistances: player.resistances,
    deck_list: player.deck?.list,
    deck_archetype: player.deck?.list ?  player.deck.id : null,
    rounds: player.rounds,
  }));

  const result = await supabase.from('Final Results').insert(rowsToBeInserted);
  return result;
};
