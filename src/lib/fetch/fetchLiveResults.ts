import {
  Deck,
  Standing,
  TopCutStatus,
  Tournament,
  TournamentStatus,
} from '../../../types/tournament';
import { StandingsFilters } from '../../components/Tournament/Results/Filters/StandingsFilterMenu';
import { fetchPlayerDecks } from '../../hooks/playerDecks';
import { fetchTournaments } from '../../hooks/tournaments';
import supabase from '../supabase/client';
import {
  getTournamentRoundSchema,
  TournamentRoundMapSchema,
} from '../tournament';
import { getPokedataStandingsUrl } from '../url';

const fetchDeckArchetypes = async () => {
  const perfStart = performance.now();

  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon,identifiable_cards,supertype');

  console.log(
    'fetchDeckArchetypes:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return res.data;
};

const updatePlayerProfilesWithTournament = async (
  parsedData: Record<string, any>[],
  tournamentId: string,
  playerProfiles?: any[] | null
) => {
  if (!playerProfiles) {
    const { data } = await supabase
      .from('Player Profiles')
      .select('id,name,email,tournament_history');
    playerProfiles = data;
  }

  const perfStart = performance.now();
  const upsertingRows = parsedData.reduce(
    (acc: Record<string, any>[], standing, idx) => {
      const player: {
        id: string;
        name: string;
        tournament_history: string[];
        email: string | null;
      } = playerProfiles?.find(({ name }) => name === standing.name) ?? {
        id: `${tournamentId}${idx}`,
        name: standing.name,
        tournament_history: [],
        email: null,
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
          email: player.email,
          tournament_history: [
            ...(player.tournament_history ?? []),
            tournamentId,
          ],
        },
      ];
    },
    []
  );
  const { error } = await supabase
    .from('Player Profiles')
    .upsert(upsertingRows, {
      onConflict: 'name',
    });

  console.log(
    'done updating players:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return { error };
};

export const getPlayerDeckObjects = async (
  tournamentId: string,
  deckArchetypes: Deck[] | null
) => {
  const perfStart = performance.now();

  const playerDecks = await fetchPlayerDecks({ tournamentId });

  const mappedDecks = playerDecks?.map(
    ({
      player_name,
      deck_archetype,
      user_submitted_was_admin,
      on_stream,
      user_who_submitted,
    }) => {
      const deck: Record<string, any> | undefined = deckArchetypes?.find(
        deck => deck.id === deck_archetype.id
      );

      return {
        player_name,
        deck: {
          id: deck_archetype.id,
          name: deck?.name ?? null,
          defined_pokemon: deck?.defined_pokemon ?? null,
          supertype: deck?.supertype,
          user_who_submitted,
          verified: user_submitted_was_admin,
          on_stream,
        },
      };
    }
  );

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
  resistances: { self: number; opp: number; oppopp: number };
  result: string;
  rounds: Record<number, Record<string, any>>;
  decklist: Record<any, any>;
  drop: number;
}

interface PlayerDeckObject {
  player_name: any;
  deck: {
    id: number;
    name: string;
    defined_pokemon: string[];
    verified: boolean;
  };
}

const matchArchetype = (
  deckArchetypes: Deck[] | null,
  list: Record<any, any>,
  targetLength: number
) =>
  deckArchetypes?.find(({ identifiable_cards }) => {
    return (
      identifiable_cards?.length === targetLength &&
      identifiable_cards?.every(
        (identifiableCard: string) =>
          list.pokemon.some(
            (pokemon: Record<string, any>) => pokemon.name === identifiableCard
          ) ||
          list.trainer.some(
            (trainer: Record<string, any>) => trainer.name === identifiableCard
          ) ||
          list.energy.some(
            (energy: Record<string, any>) => energy.name === identifiableCard
          )
      )
    );
  });

const getPlayerDeck = (
  playerDeckObjects: PlayerDeckObject[] | undefined,
  player: Player,
  deckArchetypes: Deck[] | null
) => {
  const savedDeckInfo = playerDeckObjects?.find(
    playerDeck => playerDeck.player_name === player.name
  )?.deck;
  const list = player.decklist;
  let inferredArchetypeFromList;

  if (list) {
    inferredArchetypeFromList = matchArchetype(deckArchetypes, list, 2);
    if (!inferredArchetypeFromList) {
      inferredArchetypeFromList = matchArchetype(deckArchetypes, list, 1);
    }
  }

  const playerDeck = {
    ...(savedDeckInfo ?? {}),
    ...(list ? { list } : {}),
    ...(inferredArchetypeFromList ?? {}),
  };

  return {
    ...playerDeck,
    defined_pokemon: playerDeck.defined_pokemon ?? [],
    verified: playerDeck.verified || !!list,
  };
};

export const getRoundsArray = (player?: Player) =>
  Object.values(player?.rounds ?? {});

function mapResultsArray(
  resultsArray: any,
  roundNumber: number,
  playerDeckObjects: PlayerDeckObject[] | undefined,
  deckArchetypes: Deck[] | null,
  tournamentStatus: TournamentStatus,
  shouldLoad?: LiveResultsLoadOptions
): Standing[] {
  const perfStart = performance.now();

  const mappedArray: Standing[] = resultsArray.map((player: Player) => {
    const currentMatchResult = player.rounds[roundNumber]?.result;
    const day2 = player.record.wins * 3 + player.record.ties >= 19;

    const currentOpponentName = player.rounds[roundNumber]?.name;
    const currentOpponentPlayer =
      resultsArray.find(
        (player: Player) => player.name === currentOpponentName
      ) ?? {};

    const currentOpponent =
      tournamentStatus === 'running' && player.rounds[roundNumber]
        ? {
            ...currentOpponentPlayer,
            deck: getPlayerDeck(
              playerDeckObjects,
              { name: player.rounds[roundNumber].name } as Player,
              deckArchetypes
            ),
            rounds: getRoundsArray(currentOpponentPlayer),
          }
        : null;

    return {
      name: player.name,
      placing: player.placing,
      record: player.record,
      ...(shouldLoad?.allRoundData ? { rounds: getRoundsArray(player) } : {}),
      ...(currentMatchResult ? { currentMatchResult } : {}),
      resistances: player.resistances,
      day2,
      outOfDay2:
        !day2 &&
        (19 - player.record.wins * 3 - player.record.ties) / 3 >
          9 - roundNumber,
      currentOpponent,
      deck: getPlayerDeck(playerDeckObjects, player, deckArchetypes),
      ...(player.drop > 0 ? { drop: player.drop } : {}),
    };
  });

  console.log(
    'mapResultsArray:',
    (performance.now() - perfStart) / 1000,
    'sec'
  );

  return mappedArray;
}

export const cropPlayerName = (name: string) => name.split('[')[0].trim();

export const getPokedata = async (tournamentId: string, prefetch?: boolean) => {
  const perfStart = performance.now();

  const response = await fetch(
    prefetch
      ? getPokedataStandingsUrl(tournamentId)
      : `/api/standings/?tournamentId=${tournamentId}`
  );

  if (!response.ok) return [];

  let data = await response.json();
  data = data
    .map((player: Standing) => ({
      ...player,
      name: cropPlayerName(player.name),
    }))
    .filter((player: Standing) => player.placing !== 9999);

  console.log('getPokedata:', (performance.now() - perfStart) / 1000, 'sec');

  return data;
};

export interface FetchLiveResultsOptions {
  prefetch?: boolean;
  load?: LiveResultsLoadOptions;
  filters?: StandingsFilters;
}

export interface LiveResultsLoadOptions {
  // If you just want to load every single player's round data (warning: slow)
  allRoundData?: boolean;
}

export interface FetchLoggedInPlayerOptions {
  load?: LoggedInPlayerLoadOptions;
}

export interface LoggedInPlayerLoadOptions {
  opponentRoundData?: boolean;
}

export interface LiveResults {
  tournamentStatus: TournamentStatus;
  topCutStatus: TopCutStatus;
  shouldHideDecks: boolean;
  numPlayers: number;
  roundNumber: number;
  data: Standing[];
}

export const getTopCutStatus = (
  standings: Standing[],
  tournament: Tournament | null
) => {
  const tournamentRoundSchema: TournamentRoundMapSchema | undefined = tournament
    ?.players.masters
    ? getTournamentRoundSchema(tournament?.players.masters)
    : undefined;

  const topEightRoundNumber = tournamentRoundSchema
    ? tournamentRoundSchema.rounds.dayOneSwissRounds +
      tournamentRoundSchema.rounds.dayTwoSwissRounds
    : 14;

  if (
    !tournament ||
    (standings[0]?.rounds?.length ?? 0) < topEightRoundNumber
  ) {
    return null;
  }

  if ((standings[2]?.rounds?.length ?? 0) < (standings[1]?.rounds?.length ?? 0))
    return 'finals';
  if ((standings[4]?.rounds?.length ?? 0) < (standings[3]?.rounds?.length ?? 0))
    return 'top4';
  if ((standings[8]?.rounds?.length ?? 0) < (standings[7]?.rounds?.length ?? 0))
    return 'top8';

  return null;
};

export const fetchLiveResults = async (
  tournamentId: string,
  options?: FetchLiveResultsOptions
): Promise<LiveResults> => {
  const startTime = performance.now();

  let parsedData: Standing[] = await getPokedata(
    tournamentId,
    options?.prefetch
  );

  const [tournament] = await fetchTournaments({
    tournamentId,
    prefetch: options?.prefetch,
  });

  const roundNumber = tournament?.roundNumbers.masters as number;
  const deckArchetypes = await fetchDeckArchetypes();

  const playerDeckObjects = await getPlayerDeckObjects(
    tournamentId,
    deckArchetypes
  );

  // await updatePlayerProfilesWithTournament(parsedData, tournamentId);

  parsedData = await mapResultsArray(
    parsedData,
    roundNumber,
    playerDeckObjects,
    deckArchetypes,
    tournament.tournamentStatus,
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

  // Safeguard for finals has finished
  const getFinalsHasFinished = () => {
    if (!parsedData?.[1].rounds?.length || !parsedData?.[2].rounds?.length)
      return false;

    if (parsedData[1].rounds.length === parsedData[2].rounds.length)
      return false;

    return parsedData[1].rounds[parsedData[1].rounds.length - 1].result;
  };

  const tournamentRoundSchema: TournamentRoundMapSchema | undefined = tournament
    .players.masters
    ? getTournamentRoundSchema(tournament.players.masters)
    : undefined;
  const dayOneRounds = tournamentRoundSchema?.rounds.dayOneSwissRounds ?? 9; // Default to 9 i guess

  return {
    tournamentStatus: tournament?.tournamentStatus ?? 'not-started',
    topCutStatus: getTopCutStatus(parsedData, tournament),
    shouldHideDecks: roundNumber ? roundNumber < dayOneRounds : false,
    numPlayers: parsedData.length,
    roundNumber,
    data: parsedData,
  };
};
