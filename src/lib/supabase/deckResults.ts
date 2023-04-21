import { Tournament } from '../../../types/tournament';
import { cropPlayerName } from '../fetch/fetchLiveResults';
import supabase from './client';

export const loadDeckResults = async (
  tournament: Tournament,
  shouldUpdate?: boolean
) => {
  const { data: deckResultsData } = await supabase
    .from('Deck Results')
    .select('id')
    .eq('tournament_id', tournament.id);

  // We've already inserted deck results for this tournament.
  const dataExists = deckResultsData && deckResultsData.length > 0;
  if (dataExists && !shouldUpdate) {
    console.log('We already inserted the results. Cancelling...');
    return { error: null };
  }

  const { data: finalResultsData } = await supabase
    .from('Final Results')
    .select('name,deck_archetype(id,supertype),rounds')
    .eq('tournament_id', tournament.id)
    .returns<
      {
        name: string;
        deck_archetype?: { id: number; supertype: number | null };
        rounds: { name: string; result: string }[];
      }[]
    >();

  if (!finalResultsData) {
    console.log('No final results data for this tournament.');
    return { error: null };
  }

  let rowsToBeUpserted = [];

  for (const row of finalResultsData) {
    for (const idx in row.rounds) {
      const opponent = row.rounds[idx];

      if (opponent.name === 'BYE' || opponent.name === 'LATE') continue;

      // Find someone who played you that round
      const opponentResult = finalResultsData.find(
        oppOpp =>
          oppOpp.rounds[idx]?.name &&
          cropPlayerName(oppOpp.rounds[idx]?.name) === cropPlayerName(row.name)
      );

      // Skip this one I guess
      if (!opponentResult) {
        console.log('Could not validate', opponent);
        continue;
      }

      if (!row.deck_archetype?.id || !opponentResult.deck_archetype?.id)
        continue;

      rowsToBeUpserted.push({
        tournament_id: tournament.id,
        deck_archetype: row.deck_archetype.id,
        opponent_deck: opponentResult.deck_archetype.id,
        result: opponent.result,
        deck_supertype: row.deck_archetype?.supertype ?? null,
        format: tournament.format ?? null,
      });
    }
  }

  const { error } = await supabase
    .from('Deck Results')
    .upsert(rowsToBeUpserted);

  return { error };
};
