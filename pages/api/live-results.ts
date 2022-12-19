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
    .select('name,defined_pokemon,identifiable_cards');
  return res.data;
};

const fetchPlayerProfiles = async () => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_profile_url');
  return await res.data?.reduce((acc, player) => {
    return {
      ...acc,
      [player.name]: {
        id: player.id,
        name: player.name,
        twitterUrl: player.twitter_profile_url,
      },
    };
  }, {});
};

const uploadMissingPlayerProfiles = async (
  parsedData: Record<string, any>[]
) => {
  const playerProfiles: Record<string, string> | undefined =
    await fetchPlayerProfiles();

  if (!parsedData || !playerProfiles) {
    return;
  }

  const missingPlayerRows = await parsedData.reduce(
    (acc: Record<string, any>[], { name }) => {
      if (!playerProfiles[name]) {
        return [...acc, { name }];
      }
      return acc;
    },
    []
  );
  await supabase.from('Player Profiles').insert(missingPlayerRows);
};

interface DeckArchetype {
  name: string;
  defined_pokemon: any;
  identifiable_cards: any;
}

const getPlayerDeckObjects = async (tournamentId: string, deckArchetypes: DeckArchetype[] | null) => {
  const playerDecks = await fetchPlayerDecks(tournamentId);

  return playerDecks?.map(({ player_name, deck_archetype }) => {
    const deck: Record<string, any> | undefined = deckArchetypes?.find(
      deck => deck.name === deck_archetype
    );

    return {
      player_name,
      deck: {
        name: deck_archetype,
        defined_pokemon: deck?.defined_pokemon
      },
    };
  });
};

interface Player {
  name: string;
  placing: number;
  record: { wins: number; losses: number; ties: number };
  result: string;
  rounds: Record<number, Record<string, any>>;
  decklist: Record<any, any>;
}

interface PlayerDeckObject {
  player_name: any;
  deck: {
    name: any;
    defined_pokemon: any;
  };
}

const getPlayerDeck = (
  playerDeckObjects: PlayerDeckObject[] | undefined,
  player: Player,
  deckArchetypes: DeckArchetype[] | null
) => {
  const savedDeckInfo = playerDeckObjects?.find(
    playerDeck => playerDeck.player_name === player.name
  )?.deck;
  const list = player.decklist;
  let inferredArchetypeFromList;
  
  if (list) {
    inferredArchetypeFromList = deckArchetypes?.find(({ identifiable_cards }) => {
      return identifiable_cards?.every((identifiableCard: string) => list.pokemon.some((pokemon: Record<string, any>) => pokemon.name === identifiableCard))
    });
  }

  return {
    ...(savedDeckInfo ?? {}),
    ...(list ? { list } : {}),
    ...(inferredArchetypeFromList ?? {})
  };
};

async function mapResultsArray(
  resultsArray: any,
  roundNumber: number,
  playerDeckObjects: PlayerDeckObject[] | undefined,
  deckArchetypes: DeckArchetype[] | null
): Promise<string[]> {
  const playerProfiles: Record<string, string> | undefined =
    await fetchPlayerProfiles();

  return resultsArray.map((player: Player) => ({
    name: player.name,
    profile: playerProfiles?.[player.name],
    placing: player.placing,
    record: player.record,
    currentMatchResult: player.rounds[roundNumber]?.result,
    day2: player.record.wins * 3 + player.record.ties >= 19,
    deck: getPlayerDeck(playerDeckObjects, player, deckArchetypes),
  }));
}

type Data = {
  roundNumber: number;
  data: string;
};

const getRoundNumber = (firstPlace: Record<string, any>) => {
  let highestRound = 0;
  for (const key of Object.keys(firstPlace.rounds)) {
    if (parseInt(key) > highestRound) {
      highestRound = parseInt(key);
    }
  }

  return highestRound;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(
      `https://pokedata.ovh/standings/${req.query.id}/masters/${req.query.id}_Masters.json`
    );
    let parsedData = await response.json();
    const roundNumber = getRoundNumber(parsedData[0]);

    const deckArchetypes = await fetchDeckArchetypes();
    const playerDeckObjects = await getPlayerDeckObjects(
      req.query.id as string,
      deckArchetypes
    );

    await uploadMissingPlayerProfiles(parsedData);

    parsedData = await mapResultsArray(
      parsedData,
      roundNumber,
      playerDeckObjects,
      deckArchetypes
    );

    res.status(200).json({ roundNumber, data: parsedData });
  } catch (err) {
    console.error(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
