import { useQuery } from '@tanstack/react-query';
import { Deck } from '../../../types/tournament';
import { getConversionRate } from '../stats';
import { DeckTypeSchema } from '../deckArchetypes';
import { FinalResultsDeckSchema } from './final-results-schema';
import { getDeckCounts } from './helpers';
import supabase from '../../lib/supabase/client';
import { AgeDivision } from '../../../types/age-division';
import { capitalize } from '../../lib/strings';
import { isAfter, isBefore, parseISO } from 'date-fns';

const fetchMetaShare = async (tournamentId: string, ageDivision: AgeDivision): Promise<DeckTypeSchema[] | null | undefined> => {
  const res = await supabase.from('meta_shares').select('*').eq('tournament_id', parseInt(tournamentId)).eq('age_division', capitalize(ageDivision)).order('count', { ascending: false });
  return res.data?.map((share) => ({
    id: share.deck_archetype,
    name: share.name,
    defined_pokemon: JSON.parse(share.defined_pokemon),
    type: 'archetype',
    count: share.count,
    day_two_count: share.day_two_count
  }));
}

export const useMetaShare = (tournamentId: string, ageDivision: AgeDivision) => {
  return useQuery({
    queryKey: ['meta-share', tournamentId, ageDivision],
    queryFn: () => fetchMetaShare(tournamentId, ageDivision)
  });
}

const fetchDeckMetaShare = async (ageDivision: AgeDivision): Promise<DeckTypeSchema[] | null | undefined> => {
  const res = await supabase.from('deck_meta_shares').select('*').eq('age_division', capitalize(ageDivision)).order('tournament_id', { ascending: true });
  const shares: DeckTypeSchema[] | undefined = res.data?.map((share) => ({
    id: share.deck_archetype,
    name: share.name,
    defined_pokemon: JSON.parse(share.defined_pokemon),
    type: 'archetype',
    count: share.count,
    day_two_count: share.day_two_count,
    tournament_id: share.tournament_id,
    tournament_name: share.tournament_name,
    tournament_date: JSON.parse(share.tournament_date)
  }));

  return shares?.filter((share) => share.day_two_count && (share.day_two_count >= 5)).sort((a, b) => {
    if (!a.tournament_date) return -1;
    if (!b.tournament_date) return 1;

    if (isBefore(parseISO(a.tournament_date.start), parseISO(b.tournament_date.start))) return -1;
    if (isBefore(parseISO(b.tournament_date.start), parseISO(a.tournament_date.start))) return 1;

    if (!a.tournament_id) return -1;
    if (!b.tournament_id) return 1;

    if (a.tournament_id < b.tournament_id) return -1;
    if (a.tournament_id > b.tournament_id) return 1;

    return 0;
  });
}

export const useDeckMetaShare = (ageDivision: AgeDivision) => {
  return useQuery({
    queryKey: ['deck-meta-share', ageDivision],
    queryFn: () => fetchDeckMetaShare(ageDivision)
  });
}


export const useStoredDecks = (options?: {
  tournamentId?: string;
  shouldDrillDown?: boolean;
  sortBy?: 'played' | 'day 2';
  sortOrder?: 'asc' | 'desc';
}): {
  isLoading: boolean;
  data: DeckTypeSchema[];
  decks: FinalResultsDeckSchema[];
  numberReported: number;
} => {
  const sortBy = options?.sortBy ?? 'played';
  const sortOrder = options?.sortOrder ?? 'desc';

  const { data: decks, isLoading } = useQuery({
    queryKey: [
      'stored-decks',
      options?.tournamentId,
      options?.shouldDrillDown,
    ],
    // TODO: IMPLEMENT
    queryFn: () => [{}] as unknown as FinalResultsDeckSchema[],
  });

  if (!decks)
    return {
      data: [],
      decks: [],
      isLoading,
      numberReported: 0,
    };

  const deckCounts = getDeckCounts(decks, options?.shouldDrillDown);

  if (deckCounts) {
    const ret = Object.entries(deckCounts ?? {})
      ?.map(([deckId, count]) => {
        if (deckId === 'unreported') {
          return {
            deck: {
              id: 'unreported',
              name: 'Unreported',
              defined_pokemon: ['Unown'],
            },
            count,
            day2Conversion: 0,
          };
        }

        if (deckId.includes('supertype')) {
          const realId = deckId.replace('supertype', '');
          const supertype = decks?.find(({ deck_supertype }) => {
            return deck_supertype?.id && parseInt(realId) === deck_supertype.id;
          })?.deck_supertype;

          const deck = {
            ...supertype,
            type: 'supertype',
          };

          return {
            deck,
            count,
            day2Conversion: getConversionRate(deck, decks),
          };
        }

        const realId = deckId.replace('archetype', '');
        const found = decks?.find(({ deck_archetype }) => {
          return deck_archetype?.id && parseInt(realId) === deck_archetype.id;
        });

        const deck = {
          ...(found?.deck_archetype ?? {}),
          supertype: found?.deck_supertype,
          type: 'archetype',
        };

        return {
          deck,
          count,
          day2Conversion: getConversionRate(deck, decks),
        };
      })
      .sort((a, b) => {
        if (a.count <= 20 || a.deck.name === 'Other') return 1;
        if (b.count <= 20 || b.deck.name === 'Other') return -1;

        if (sortBy === 'day 2') {
          if (sortOrder === 'desc') {
            if (a.day2Conversion < b.day2Conversion) return 1;
            if (b.day2Conversion < a.day2Conversion) return -1;
          }

          if (sortOrder === 'asc') {
            if (a.day2Conversion > b.day2Conversion) return 1;
            if (b.day2Conversion > a.day2Conversion) return -1;
          }
        }

        if (sortBy === 'played') {
          if (sortOrder === 'desc') {
            if (a.count < b.count) return 1;
            if (b.count < a.count) return -1;
          }

          if (sortOrder === 'asc') {
            if (a.count > b.count) return 1;
            if (b.count > a.count) return -1;
          }
        }

        return 0;
      });
    return {
      isLoading,
      decks,
      data: ret
        .filter(({ deck }) => deck.id !== 'unreported')
        .map(({ deck, count }) => ({ ...deck, count })),
      numberReported: decks.filter(deck => deck.deck_archetype).length,
    };
  }

  return {
    data: [],
    decks: [],
    isLoading,
    numberReported: 0,
  };
};
