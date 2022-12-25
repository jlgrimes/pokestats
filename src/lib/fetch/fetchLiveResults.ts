import supabase from '../supabase/client';

const fetchPlayerDecks = async (tournamentId: string) => {
  const res = await supabase
    .from('Player Decks')
    .select('player_name,deck_archetype')
    .eq('tournament_id', tournamentId);
  return res.data;
};

const fetchDeckArchetypes = async () => {
  const perfStart = performance.now();

  const res = await supabase
    .from('Deck Archetypes')
    .select('name,defined_pokemon,identifiable_cards,supertype');

  console.log(
    'fetchDeckArchetypes:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return res.data;
};

const fetchPlayerProfiles = async () => {
  const perfStart = performance.now();

  const res = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle');
  const profiles = await res.data?.reduce((acc, player) => {
    return {
      ...acc,
      [player.name]: {
        id: player.id,
        name: player.name,
        twitterHandle: player.twitter_handle,
      },
    };
  }, {});

  console.log(
    'fetchPlayerProfiles:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );
  return profiles;
};

const uploadMissingPlayerProfiles = async (
  parsedData: Record<string, any>[],
  playerProfiles: Record<string, string> | undefined
) => {
  const perfStart = performance.now();

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

  if (missingPlayerRows.length > 0) {
    await supabase.from('Player Profiles').insert(missingPlayerRows);
  }

  console.log(
    'uploadMissingPlayerProfiles:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );
};

interface DeckArchetype {
  name: string;
  defined_pokemon: any;
  identifiable_cards: any;
}

const getPlayerDeckObjects = async (
  tournamentId: string,
  deckArchetypes: DeckArchetype[] | null
) => {
  const perfStart = performance.now();

  const playerDecks = await fetchPlayerDecks(tournamentId);

  const mappedDecks = playerDecks?.map(({ player_name, deck_archetype }) => {
    const deck: Record<string, any> | undefined = deckArchetypes?.find(
      deck => deck.name === deck_archetype
    );

    return {
      player_name,
      deck: {
        name: deck_archetype,
        defined_pokemon: deck?.defined_pokemon,
      },
    };
  });

  console.log(
    'getPlayerDeckObjects:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return mappedDecks;
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
    inferredArchetypeFromList = deckArchetypes?.find(
      ({ identifiable_cards }) => {
        return identifiable_cards?.every((identifiableCard: string) =>
          list.pokemon.some(
            (pokemon: Record<string, any>) => pokemon.name === identifiableCard
          )
        );
      }
    );
  }

  const playerDeck = {
    ...(savedDeckInfo ?? {}),
    ...(list ? { list } : {}),
    ...(inferredArchetypeFromList ?? {}),
  };

  return {
    ...playerDeck,
    defined_pokemon: playerDeck.defined_pokemon ?? ['substitute']
  };
};

function mapResultsArray(
  resultsArray: any,
  roundNumber: number,
  playerDeckObjects: PlayerDeckObject[] | undefined,
  deckArchetypes: DeckArchetype[] | null,
  playerProfiles: Record<string, string> | undefined
): string[] {
  const perfStart = performance.now();

  const mappedArray = resultsArray.map((player: Player) => {
    const currentMatchResult = player.rounds[roundNumber]?.result;

    return {
      name: player.name,
      profile: playerProfiles?.[player.name] ?? null,
      placing: player.placing,
      record: player.record,
      ...(currentMatchResult ? { currentMatchResult } : {}),
      day2: player.record.wins * 3 + player.record.ties >= 19,
      deck: getPlayerDeck(playerDeckObjects, player, deckArchetypes),
    };
  });

  console.log(
    'mapResultsArray:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return mappedArray;
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

const getPokedata = async (tournamentId: string, prefetch?: boolean) => {
  const perfStart = performance.now();

  const response = await fetch(
    `${
      prefetch ? 'https://pokedata.ovh' : '/pokedata'
    }/standings/${tournamentId}/masters/${tournamentId}_Masters.json`
  );
  const data = await response.json();

  console.log('getPokedata:', (performance.now() - perfStart) / 1000, 'sec');

  return data;
};

export const fetchLiveResults = async (
  tournamentId: string,
  prefetch?: boolean
) => {
  const startTime = performance.now();

  let parsedData = await getPokedata(tournamentId as string, prefetch);
  const roundNumber = getRoundNumber(parsedData[0]);

  const deckArchetypes = await fetchDeckArchetypes();

  const playerDeckObjects = await getPlayerDeckObjects(
    tournamentId,
    deckArchetypes
  );
  console.log(playerDeckObjects)

  const playerProfiles: Record<string, string> | undefined =
    await fetchPlayerProfiles();

  await uploadMissingPlayerProfiles(parsedData, playerProfiles);

  parsedData = await mapResultsArray(
    parsedData,
    roundNumber,
    playerDeckObjects,
    deckArchetypes,
    playerProfiles
  );
  const endTime = performance.now();

  console.log('Total time:', (endTime - startTime) / 1000, 'sec');
  // The criteria of the tournament being completed is if there's a list published,
  // which is the case except in the few days before lists are published on RK9.
  // So, there are a few inaccurate days where 1 and 2 seed will be colored and the
  // tournament is finished.
  return {
    live: !parsedData[0]?.deck?.list,
    numPlayers: parsedData.length,
    roundNumber,
    data: parsedData,
  };
};
