// TODO: Eventually merge with finalResults.ts

import { fetchLiveResults } from '../fetch/fetchLiveResults';
import supabase from './client';
import { TournamentStatus } from '../../../types/tournament';

export const loadLiveResults = async (
  tournamentId: string,
  tournamentStatus: TournamentStatus
) => {
  const { data: liveResultsData } = await supabase
    .from('Live Results')
    .select('*')
    .eq('tournament_id', tournamentId);
  const dataExists = liveResultsData && liveResultsData.length > 0;

  // Should add to DB only if tournament is running or there is no data
  if (!(tournamentStatus === 'running' || !dataExists)) {
    console.log('Tournament is not live and data exists. Cancelling...');
    return { error: null };
  }

  const { data: playerData } = await fetchLiveResults(
    tournamentId,
    {
      load: { allRoundData: true },
      prefetch: true,
    }
  );

  if (dataExists) {
    const rowsToBeUpserted = liveResultsData.map(liveResult => {
      const player = playerData.find(
        ({ placing }) => placing === liveResult.placing
      );

      if (!player) return {};

      return {
        ...liveResult,
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
      .from('Live Results')
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
      .from('Live Results')
      .insert(rowsToBeInserted);
    return result;
  }
};
