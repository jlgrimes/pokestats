import { differenceInHours } from 'date-fns';
import {
  Deck,
  Standing,
  TopCutStatus,
  Tournament,
  TournamentStatus,
} from '../../../types/tournament';
import { StandingsFilters } from '../../components/Tournament/Results/Filters/StandingsFilterMenu';
import { fetchDecks, getDecksInFormat } from '../../hooks/deckArchetypes';
import { fetchFormats, FormatSchema } from '../../hooks/formats/formats';
import { getTournamentFormat } from '../../hooks/formats/helpers';
import { fetchPlayerDecks } from '../../hooks/playerDecks';
import { fetchTournaments } from '../../hooks/tournaments';
import {
  getTournamentRoundSchema,
  ifPlayerDay2,
  TournamentRoundMapSchema,
} from '../tournament';
import { getPokedataStandingsUrl } from '../url';

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

  // console.log(
  //   'getPlayerDeckObjects:',
  //   (performance.now() - perfStart) / 1000,
  //   'sec'
  // );

  return mappedDecks;
};

export interface Player {
  name: string;
  placing: number;
  record: { wins: number; losses: number; ties: number };
  resistances: { self: number; opp: number; oppopp: number };
  result: string;
  rounds: Record<number, Record<string, any>>;
  decklist: Record<any, any>;
  drop: number;
  region?: string;
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
) => {
  if (!list.pokemon) list = JSON.parse(list as unknown as string);
  if (!list.pokemon) return null

  return deckArchetypes?.find(({ identifiable_cards }) => {
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
}


export const getPlayerDeck = (
  playerDeckObjects: PlayerDeckObject[] | undefined,
  player: Player,
  deckArchetypes: Deck[] | null
) => {
  const savedDeckInfo = playerDeckObjects?.find(
    playerDeck => playerDeck.player_name === player.name
  )?.deck;
  let list = player.decklist
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

export const getRoundsArray = (player?: Standing) =>
  Object.values(player?.rounds ?? {});

export const cropPlayerName = (name: string) => name?.split('[')[0].trim();
export const getPlayerRegion = (name: string) => name.match(/\[(.*?)\]/);