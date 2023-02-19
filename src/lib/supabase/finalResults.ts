import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';

export const loadFinalResults = async (
  tournamentId: string,
  shouldUpdate?: boolean
) => {
  const { data: finalResultsData } = await supabase
    .from('Final Results')
    .select('id,created_at,name')
    .eq('tournament_id', tournamentId);

  // We've already inserted final results for this tournament.
  const dataExists = finalResultsData && finalResultsData.length > 0;
  if (dataExists && !shouldUpdate) {
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

  if (dataExists) {
    const rowsToBeUpserted = finalResultsData.map(finalResult => {
      const player = playerData.find(({ name }) => name === finalResult.name);

      if (!player) return {};

      return {
        ...finalResult,
        name: player.name,
        placing: player.placing,
        record: player.record,
        resistances: player.resistances,
        deck_list: player.deck?.list ?? null,
        deck_archetype: player.deck?.list ? player.deck.id : null,
        deck_supertype: player.deck?.supertype ?? null,
        rounds: player.rounds,
        tournament_id: tournamentId,
      };
    });

    const result = await supabase
      .from('Final Results')
      .upsert(rowsToBeUpserted);
    return result;
  } else {
    // Fire away!
    const rowsToBeInserted = playerData.map(player => ({
      tournament_id: tournamentId,
      name: player.name,
      placing: player.placing,
      record: player.record,
      resistances: player.resistances,
      deck_list: player.deck?.list ?? null,
      deck_archetype: player.deck?.list ? player.deck.id : null,
      rounds: player.rounds,
    }));

    const result = await supabase
      .from('Final Results')
      .insert(rowsToBeInserted);
    return result;
  }
};
