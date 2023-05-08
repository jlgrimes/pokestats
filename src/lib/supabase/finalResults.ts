import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';
import { FormatSchema } from '../../hooks/formats/formats';

export const loadFinalResults = async (
  tournamentId: string,
  shouldUpdate?: boolean,
  format?: FormatSchema
) => {
  const { data: finalResultsData } = await supabase
    .from('Final Results')
    .select('*')
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
      const player = playerData.find(
        ({ placing }) => placing === finalResult.placing
      );

      if (!player) return {};

      return {
        ...finalResult,
        name: player.name,
        placing: player.placing,
        record: player.record,
        resistances: player.resistances,
        rounds: player.rounds,
        tournament_id: tournamentId,
        deck_list: player.deck?.list ?? null,
        deck_archetype: player.deck?.id ?? null,
        deck_supertype: player.deck?.supertype?.id ?? null,
        day2: player.day2 ?? null,
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
      deck_archetype: player.deck?.id ?? null,
      deck_supertype: player.deck?.supertype?.id ?? null,
      rounds: player.rounds,
      uploaded_list_path: null,
    }));

    const result = await supabase
      .from('Final Results')
      .insert(rowsToBeInserted);
    return result;
  }
};
