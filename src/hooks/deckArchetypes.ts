import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Deck, Standing, Tournament } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { FormatSchema } from './formats/formats';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchDecks = async (): Promise<Deck[]> => {
  let query = supabase
    .from('Deck Archetypes')
    .select(
      `id,name,defined_pokemon,supertype (
      id,
      name,
      defined_pokemon,
      cover_cards
    ),identifiable_cards,format(id,format,rotation,start_date)`
    )
    .order('created_at', { ascending: false });

  const res = await query.returns<
    {
      id: number;
      name: string;
      defined_pokemon: string[];
      supertype: DeckTypeSchema;
      identifiable_cards: string[];
      format: FormatSchema;
    }[]
  >();

  return res.data ?? [];
};

export const getDecksInFormat = (decks: Deck[], format?: FormatSchema) =>
  format
    ? decks.filter(
        deck => deck.format?.id === format.id || deck.name === 'Other'
      )
    : decks;

export const convertDecksToArchetypes = (decks: Deck[]): DeckTypeSchema[] => {
  return decks.map(archetype => {
    const supertype = Array.isArray(archetype.supertype)
      ? archetype.supertype[0]
      : archetype.supertype ?? {
          id: -1,
          name: archetype.name,
          defined_pokemon: archetype.defined_pokemon,
          cover_cards: archetype.identifiable_cards,
        };

    return {
      ...archetype,
      type: 'archetype',
      cover_cards: archetype.identifiable_cards,
      supertype,
    };
  });
};

export const fetchArchetypes = async (
  format?: FormatSchema
): Promise<DeckTypeSchema[] | null> => {
  const data = await fetchDecks();

  if (data) {
    return convertDecksToArchetypes(data);
  }

  return data;
};

export const fetchArchetype = async (archetypeId: number) => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon,identifiable_cards,supertype')
    .eq('id', archetypeId);
  return res.data?.[0];
};

export const fetchVariants = async (supertypeId: number | undefined) => {
  if (!supertypeId) return null;

  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon,format')
    .eq('supertype', supertypeId);
  return res.data;
};

export const useVariants = (
  supertypeId: number | undefined,
  format?: number
) => {
  const { data, ...rest } = useQuery({
    queryKey: ['deck-variants', supertypeId],
    queryFn: () => fetchVariants(supertypeId),
  });

  if (data && format) {
    return {
      data: data.filter(variant => variant.format === format),
      ...rest,
    };
  }

  return {
    data,
    ...rest,
  };
};

export const useDecks = (format?: FormatSchema) => {
  const { data, ...rest } = useQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchDecks(),
  });

  if (data && format) {
    return {
      ...rest,
      data: getDecksInFormat(data, format),
    };
  }

  return {
    ...rest,
    data,
  };
};

export const useArchetypes = (format?: FormatSchema) => {
  const decks = useDecks(format);

  return decks.data
    ? {
        ...decks,
        data: convertDecksToArchetypes(decks.data),
      }
    : {
        ...decks,
        data: null,
      };
};

export interface SupertypeSchema {
  id: number;
  name: string;
  defined_pokemon: string[];
  cover_cards?: string[];
}

export type DeckClassification = 'archetype' | 'supertype';

export interface DeckTypeSchema extends SupertypeSchema {
  type: DeckClassification;
  supertype?: SupertypeSchema;
  count?: number;
  data?: Record<string, any>;
  format?: FormatSchema;
}

export const fetchSupertypes = async () => {
  const res = await supabase
    .from('Deck Supertypes')
    .select(`id,name,defined_pokemon,cover_cards`);

  if (res.data) {
    return res.data.map(supertype => ({
      ...supertype,
      type: 'supertype',
    }));
  }

  return res.data;
};

export const fetchSupertype = async (
  supertypeId?: number
): Promise<Deck | null> => {
  const res = await supabase
    .from('Deck Supertypes')
    .select(`id,name,defined_pokemon,cover_cards`)
    .eq('id', supertypeId);

  if (res.data) {
    const deck = res.data[0];

    const info = {
      id: deck.id,
      name: deck.name,
      defined_pokemon: deck.defined_pokemon,
      identifiable_cards: deck.cover_cards,
    };

    return {
      ...info,
      supertype: {
        ...info,
        type: 'supertype',
        cover_cards: info.identifiable_cards,
      },
    };
  }

  return null;
};

export const useSupertypes = () => {
  return useQuery({
    queryKey: ['supertypes'],
    queryFn: () => fetchSupertypes(),
  });
};

const addArchetype = async ({
  name,
  supertypeId,
  pokemon1,
  pokemon2,
  identifiableCard1,
  identifiableCard2,
  format,
}: {
  name: string;
  supertypeId: number | null;
  pokemon1: string;
  pokemon2: string;
  identifiableCard1: string;
  identifiableCard2: string;
  format: number;
}) => {
  const result = await supabase.from('Deck Archetypes').insert([
    {
      name,
      supertype: supertypeId,
      defined_pokemon: [pokemon1, pokemon2].filter(
        pokemon => pokemon.length > 0
      ),
      identifiable_cards: [identifiableCard1, identifiableCard2].filter(
        card => card.length > 0
      ),
      format,
    },
  ]);
  if (result.error) {
    throw result.error;
  }
  return result;
};

export const useMutateArchetypes = (onClose: () => void) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(['deck-archetypes'], addArchetype, {
    onSuccess: () => {
      queryClient.invalidateQueries(['deck-archetypes']);

      toast({
        title: 'Successfully created archetype!',
        status: 'success',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating archetype',
        description: error.message,
        status: 'error',
      });
    },
  });

  return mutation;
};

interface MostPopularArchetypesOptions {
  shouldIncludeDecksNotPlayed?: boolean;
}

export const useMostPopularArchetypes = (
  tournament?: Tournament,
  options?: MostPopularArchetypesOptions
) => {
  const { data: liveResults, isLoading: liveResultsIsLoading } =
    useLiveTournamentResults(tournament?.id ?? '', {
      load: { allRoundData: true },
    });
  const {
    data: archetypes,
    refetch,
    isLoading: archetypesIsLoading,
  } = useArchetypes(tournament?.format);

  const playerDeckCounts = liveResults?.data?.reduce(
    (
      acc: Record<string, { deck: DeckTypeSchema; count: number }>,
      player: Standing
    ) => {
      if (player.deck && player.deck.id) {
        // Adds in supertype
        const playerDeck = archetypes?.find(
          archetype => archetype.id === player.deck?.id
        );

        if (acc[player.deck.id]) {
          return {
            ...acc,
            [player.deck.id]: {
              deck: playerDeck,
              count: acc[player.deck.id].count + 1,
            },
          };
        }
        return {
          ...acc,
          [player.deck.id]: {
            deck: playerDeck,
            count: 1,
          },
        };
      }
      return acc;
    },
    {}
  );

  if (!playerDeckCounts) {
    return {
      data: null,
      isLoading: archetypesIsLoading || liveResultsIsLoading,
      refetchArchetypes: refetch,
    };
  }

  if (options?.shouldIncludeDecksNotPlayed) {
    const sortedArchetypes = archetypes?.sort((a, b) => {
      if (!playerDeckCounts[a.id]) {
        return 1;
      }
      if (!playerDeckCounts[b.id]) {
        return -1;
      }

      if (playerDeckCounts[a.id].count > playerDeckCounts[b.id].count) {
        return -1;
      }
      if (
        playerDeckCounts[a.id].count < playerDeckCounts[b.id].count ||
        playerDeckCounts[a.id]
      ) {
        return 1;
      }

      return 0;
    });

    return {
      data: sortedArchetypes,
      isLoading: archetypesIsLoading || liveResultsIsLoading,
      refetchArchetypes: refetch,
    };
  }

  const deckArchetypes = Object.values(playerDeckCounts);

  const sortedArchetypes = deckArchetypes?.sort((a, b) => {
    if (a.count > a.count || !b.count) {
      return -1;
    }

    if (a.count < b.count || !a.count) {
      return 1;
    }

    return 0;
  });

  return {
    data: sortedArchetypes.map(({ deck }) => deck),
    refetchArchetypes: refetch,
  };
};
