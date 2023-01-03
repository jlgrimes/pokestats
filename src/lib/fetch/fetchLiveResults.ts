import { StoredPlayerProfile } from '../../../types/player';
import { DeckArchetype, Standing } from '../../../types/tournament';
import supabase from '../supabase/client';

export const fetchPlayerDecks = async (tournamentId: string) => {
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

const updatePlayerProfilesWithTournament = async (
  parsedData: Record<string, any>[],
  tournamentId: string
) => {
  const tournamentPlayerNames: string[] = parsedData.map(({ name }) => name);
  const { data: playerProfiles } = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle,tournament_history')
    .filter(
      'name',
      'in',
      JSON.stringify(tournamentPlayerNames).replace('[', '(').replace(']', ')')
    );

  const perfStart = performance.now();
  const upsertingRows = parsedData.reduce(
    (acc: Record<string, any>[], standing, idx) => {
      const player: {
        id: string;
        name: string;
        tournament_history: string[];
        twitter_handle: string | null;
      } = playerProfiles?.[standing.name] ?? {
        id: `${tournamentId}${idx}`,
        name: standing.name,
        tournament_history: [],
        twitter_handle: null,
      };
      const shouldUpdatePlayerProfile =
        !player.tournament_history.includes(tournamentId);
      const duplicateName =
        parsedData.filter(dataStanding => dataStanding.name === standing.name)
          ?.length > 1;

      if (!shouldUpdatePlayerProfile || duplicateName) {
        return acc;
      }

      return [
        ...acc,
        {
          id: player.id,
          name: player.name,
          twitter_handle: player.twitter_handle,
          tournament_history: [
            ...(player.tournament_history ?? []),
            tournamentId,
          ],
        },
      ];
    },
    []
  );
  await supabase.from('Player Profiles').upsert(upsertingRows, {
    onConflict: 'name',
  });
  console.log(
    'done updating players:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );
};

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
    defined_pokemon: playerDeck.defined_pokemon ?? ['substitute'],
  };
};

function mapResultsArray(
  resultsArray: any,
  roundNumber: number,
  playerDeckObjects: PlayerDeckObject[] | undefined,
  deckArchetypes: DeckArchetype[] | null,
  shouldLoad?: LiveResultsLoadOptions
): Standing[] {
  const perfStart = performance.now();

  const mappedArray: Standing[] = resultsArray.map((player: Player) => {
    const currentMatchResult = player.rounds[roundNumber]?.result;

    return {
      name: player.name,
      placing: player.placing,
      record: player.record,
      ...(shouldLoad?.roundData
        ? { rounds: Object.values(player?.rounds ?? {}) }
        : {}),
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
  let data = await response.json();
  data = data.map((player: Standing) => ({
    ...player,
    name: player.name.split('[')[0].trim(),
  }));

  console.log('getPokedata:', (performance.now() - perfStart) / 1000, 'sec');

  return data;
};

export interface FetchLiveResultsOptions {
  prefetch?: boolean;
  load?: LiveResultsLoadOptions;
}

export interface LiveResultsLoadOptions {
  roundData?: boolean;
}

export interface FetchLoggedInPlayerOptions {
  load?: LoggedInPlayerLoadOptions;
}

export interface LoggedInPlayerLoadOptions {
  opponentRoundData?: boolean;
}

export const fetchLiveResults = async (
  tournamentId: string,
  options?: FetchLiveResultsOptions
) => {
  const startTime = performance.now();

  let parsedData: Standing[] = await getPokedata(
    tournamentId as string,
    options?.prefetch
  );
  const roundNumber = getRoundNumber(parsedData[0]);

  const deckArchetypes = await fetchDeckArchetypes();

  const playerDeckObjects = await getPlayerDeckObjects(
    tournamentId,
    deckArchetypes
  );

  await updatePlayerProfilesWithTournament(parsedData, tournamentId);

  parsedData = await mapResultsArray(
    parsedData,
    roundNumber,
    playerDeckObjects,
    deckArchetypes,
    options?.load
  );
  const endTime = performance.now();

  console.log(
    'Finished for',
    tournamentId,
    '. Total time:',
    (endTime - startTime) / 1000,
    'sec'
  );
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
