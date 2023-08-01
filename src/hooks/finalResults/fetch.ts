import { useQuery } from '@tanstack/react-query';
import { isAfter, parseISO } from 'date-fns';
import { FinalResultsSchema } from '../../../types/final-results';
import { Deck, Standing } from '../../../types/tournament';
import supabase from '../../lib/supabase/client';
import { fetchPlayerDecks } from '../playerDecks';
import { fetchAllVerifiedUsers, normalizeName } from '../user';
import {
  FinalResultsDeckSchema,
  FinalResultsFilters,
} from './final-results-schema';
import {
  addUserReportedDecksToFinalResults,
  mapFinalResultsToStandings,
} from './helpers';

export const fetchDecksByPlayer = async (name: string) => {
  const res = await supabase
    .from('Player Decks')
    .select(
      `tournament_id,deck_archetype (
      id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    )`
    )

    .ilike('player_name', name)
    .order('created_at', { ascending: false });
  return res.data;
};

export const fetchUniqueDecks = async () => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_archetype`)
    .neq('deck_archetype', null);

  if (!res.data) return [];

  const uniqueDecks = Array.from(new Set(res.data ?? []));
  return uniqueDecks;
};

export const fetchPlayers = async () => {
  const res = await supabase.from('Final Results').select('name');
  const uniqueNames: string[] = Array.from(
    new Set(res.data?.map(({ name }) => name) ?? [])
  );
  return uniqueNames;
};

export const useFinalResultsPlayers = () => {
  return useQuery({
    queryKey: ['final-results-players'],
    queryFn: fetchPlayers,
  });
};

export const fetchDecksWithLists = async (
  tournamentId?:string
): Promise<FinalResultsDeckSchema[] | null> => {
  let query = supabase
    .from('Final Results')
    .select(
      `deck_archetype(id,name,defined_pokemon),deck_supertype(id,name,defined_pokemon),tournament_id,day2`
    );

  if (tournamentId) {
    query = query.eq('tournament_id', tournamentId);
  }

  const res = await query;
  return res.data;
};

export const fetchFinalResults = async (
  filters?: FinalResultsFilters
): Promise<Standing[] | null | undefined> => {
  let query = supabase
    .from('Final Results')
    .select(
      `name,placing,record,resistances,rounds,tournament_id,deck_list,deck_archetype (
    id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype,
      format
    ),deck_supertype,uploaded_list_path${filters?.shouldExpandTournament ? ',tournament(id,name,date,tournamentStatus,players,roundNumbers,rk9link,subStatus,winners,format)' : ''}`
    )
    .order('tournament', { ascending: false })
    .order('placing', { ascending: true });

  if (filters?.tournamentId) {
    query = query.eq('tournament_id', filters.tournamentId);
  }
  if (filters?.deckId) {
    query = query.eq('deck_archetype', filters.deckId);
  }
  if (filters?.supertypeId) {
    query = query.eq('deck_supertype', filters.supertypeId);
  }
  if (filters?.format) {
    query = query.eq('deck_archetype.format', filters.format);
  }
  if (filters?.shouldExpandTournament) {
    query = query.not('tournament', 'is', null);
  }

  if (filters?.playerName) {
    if (filters.additionalNames) {
      const nameQueryString = [filters.playerName, ...filters.additionalNames]
        .map(name => `name.eq.${name}`)
        .join(',');
      query = query.or(nameQueryString);
    } else {
      query = query.ilike('name', filters.playerName);
    }
  }

  if (filters?.placing) {
    query = query.eq('placing', filters.placing);
  }

  const res = await query.returns<FinalResultsSchema[]>();
  let finalResultsData: FinalResultsSchema[] | null = res.data;

  // Ongoing issue: https://github.com/orgs/supabase/discussions/11859
  if (filters?.shouldExpandTournament) {
    finalResultsData = finalResultsData?.sort((a, b) => isAfter(parseISO(b.tournament!.date.start), parseISO(a.tournament!.date.start)) ? 1 : -1) ?? null;
  }

  let userReportedDecks: Deck[] | undefined | null = null;
  if (filters?.playerName) {
    const playerDecks = await fetchDecksByPlayer(filters.playerName);
    userReportedDecks = playerDecks?.map(
      ({ deck_archetype, tournament_id }) => ({
        player_name: filters.playerName,
        ...(Array.isArray(deck_archetype)
          ? deck_archetype[0]
          : (deck_archetype as Deck)),
        tournament_id,
      })
    );
  } else if (filters?.supertypeId) {
    const playerDecks = await fetchPlayerDecks({
      supertypeId: filters.supertypeId,
    });
    userReportedDecks = playerDecks?.map(({ deck_archetype, player_name }) => ({
      player_name,
      ...(Array.isArray(deck_archetype)
        ? deck_archetype[0]
        : (deck_archetype as Deck)),
    }));
  }

  if (!finalResultsData) return null;

  if (filters?.additionalNames && filters.playerName) {
    finalResultsData = finalResultsData.map(result => ({
      ...result,
      name: filters.playerName as string,
    }));
  }

  const finalResultsAsStandings = mapFinalResultsToStandings(finalResultsData);

  if (userReportedDecks) {
    return addUserReportedDecksToFinalResults(
      finalResultsAsStandings,
      userReportedDecks
    );
  }
  return finalResultsAsStandings;
};

export const fetchVerifiedUserTournaments = async () => {
  const verifiedUsers = await fetchAllVerifiedUsers();
  const verifiedUserEmailMap: Record<string, string> =
    verifiedUsers?.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr.email,
      };
    }, {}) ?? {};

  const res = await supabase
    .from('Final Results')
    .select(`name,tournament_id`)
    .filter(
      'name',
      'in',
      JSON.stringify(verifiedUsers?.map(({ name }) => name as string) ?? [])
        .replace('[', '(')
        .replace(']', ')')
    );

  return res.data?.map(result => ({
    ...result,
    email: verifiedUserEmailMap[result.name],
  }));
};
