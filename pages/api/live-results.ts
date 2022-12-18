// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../src/lib/supabase/client';

const fetchPlayerDecks = async (tournamentId: string) => {
  const res = await supabase
    .from('Player Decks')
    .select('player_name,deck_archetype')
    .eq('tournament_id', tournamentId);
  return res.data;
};

const fetchDeckArchetypes = async () => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('name,defined_pokemon');
  return res.data;
};

const getPlayerDeckObjects = async (tournamentId: string) => {
  const playerDecks = await fetchPlayerDecks(tournamentId);
  const deckArchetypes = await fetchDeckArchetypes();

  return playerDecks?.map(({ player_name, deck_archetype }) => {
    return {
      player_name,
      deck: {
        name: deck_archetype,
        defined_pokemon: deckArchetypes?.find(
          deck => deck.name === deck_archetype
        )?.defined_pokemon,
      },
    };
  });
};

async function mapResultsArray(resultsArray: any, tournamentId: string) {
  const playerDeckObjects = await getPlayerDeckObjects(tournamentId);

  return resultsArray.map(
    (player: {
      name: string;
      placing: number;
      record: { wins: number; losses: number; ties: number };
    }) => ({
      name: player.name,
      placing: player.placing,
      record: player.record,
      day2: player.record.wins * 3 + player.record.ties >= 19,
      deck: playerDeckObjects?.find((playerDeck) => playerDeck.player_name === player.name)?.deck
    })
  );
}

type Data = {
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(
      `https://pokedata.ovh/standings/${req.query.id}/masters/${req.query.id}_Masters.json`
    );
    let data = await response.text();
    data = data.replaceAll('"rounds"', ',"rounds"');
    let parsedData = JSON.parse(data);
    parsedData = await mapResultsArray(parsedData, req.query.id)

    res.status(200).json({ data: parsedData });
  } catch (err) {
    console.error(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
