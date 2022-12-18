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

const fetchPlayerProfiles = async () => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_profile_url');
  return res.data?.reduce((acc, playerProfile) => {
    return {
      ...acc,
      [playerProfile.name]: {
        playerId: playerProfile.id,
        twitterUrl: playerProfile.twitter_profile_url,
      },
    };
  }, {});
};

const uploadMissingPlayerProfiles = async (
  parsedData: Record<string, any>[],
  playerProfiles: Record<string, any> | undefined
) => {
  if (!parsedData || !playerProfiles) {
    return;
  }

  const missingPlayerRows = parsedData.reduce(
    (acc: Record<string, any>[], { name }) => {
      if (!playerProfiles[name]) {
        return [...acc, { name }];
      }
      return acc;
    },
    []
  );
  console.log(missingPlayerRows)

  await supabase
    .from('Player Profiles')
    .insert(missingPlayerRows);
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

async function mapResultsArray(
  resultsArray: any,
  roundNumber: number,
  loadedPlayerProfile: Record<string, string> | undefined,
  playerDeckObjects:
    | {
        player_name: any;
        deck: {
          name: any;
          defined_pokemon: any;
        };
      }[]
    | undefined
): Promise<string[]> {
  return resultsArray.map(
    (player: {
      name: string;
      placing: number;
      record: { wins: number; losses: number; ties: number };
      result: string;
      rounds: Record<number, Record<string, any>>;
    }) => ({
      name: player.name,
      profile: loadedPlayerProfile?.[player.name],
      placing: player.placing,
      record: player.record,
      currentMatchResult: player.rounds[roundNumber]?.result,
      day2: player.record.wins * 3 + player.record.ties >= 19,
      deck: playerDeckObjects?.find(
        playerDeck => playerDeck.player_name === player.name
      )?.deck,
    })
  );
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
    let data = await response.text();
    let parsedData = JSON.parse(data);
    const roundNumber = getRoundNumber(parsedData[0]);

    const playerProfile: Record<string, string> | undefined =
      await fetchPlayerProfiles();
    const playerDeckObjects = await getPlayerDeckObjects(
      req.query.id as string
    );

    parsedData = await mapResultsArray(
      parsedData,
      roundNumber,
      playerProfile,
      playerDeckObjects
    );

    res.status(200).json({ roundNumber, data: parsedData });

    await uploadMissingPlayerProfiles(parsedData, playerProfile);
  } catch (err) {
    console.error(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
