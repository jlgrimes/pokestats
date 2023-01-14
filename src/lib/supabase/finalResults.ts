import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';

export const loadFinalResults = async (tournamentId: string) => {
  const res = await supabase
    .from('Final Results')
    .select('id')
    .eq('tournament_id', tournamentId);

  // We've already inserted final results for this tournament.
  if (res.data && res.data.length > 0) return;

  // If the tournament is still ongoing

  const results = await fetchLiveResults(tournamentId, {
    load: { allRoundData: true },
    prefetch: true
  });
  return results;
};
