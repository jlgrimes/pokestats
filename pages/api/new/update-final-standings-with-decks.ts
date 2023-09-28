import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { fetchPlayerDecks } from '../../../src/hooks/playerDecks';
import { fetchDecks } from '../../../src/hooks/deckArchetypes';
import supabase from '../../../src/lib/supabase/client';
import { Player, getPlayerDeck, getPlayerDeckObjects } from '../../../src/lib/fetch/fetchLiveResults';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchTournaments();
    const allDecks = await fetchDecks();

    for await (const tournament of tournaments) {
      console.log('Updating final standings with decks for', tournament.name, '...');

      const { data: standings, error } = await supabase.from('standings_new').select('id,name,decklist,deck_archetype');
      if (error) throw error;

      const playerDecks = await getPlayerDeckObjects(tournament.id, allDecks);
      if (!playerDecks) throw 'No player decks';
      
      const standingsWithDecks = standings.reduce((acc: { id: any, deck_archetype: number }[], standing) => {
        const deck = getPlayerDeck(playerDecks, { name: standing.name, decklist: standing.decklist === '' ? '{}' : JSON.parse(standing.decklist) } as Player, allDecks);

        if (!deck.id) return acc;

        return [
          ...acc,
          {
            id: standing.id,
            deck_archetype: deck.id
          }
        ];
      }, []);

      console.log('Uploading...');
      const { error: upsertErr } = await supabase.from('standings_new').upsert(standingsWithDecks);

      if (upsertErr) throw upsertErr;
    }
    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
