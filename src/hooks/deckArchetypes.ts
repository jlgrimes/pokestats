import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchArchetypes = async (): Promise<DeckTypeSchema[] | null> => {
  const res = await supabase.from('Deck Archetypes')
    .select(`id,name,defined_pokemon,supertype (
      id,
      name,
      defined_pokemon,
      cover_cards
    ),identifiable_cards`);

  if (res.data) {
    return res.data.map(archetype => {
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
  }

  return res.data;
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
    .select('id,name,defined_pokemon')
    .eq('supertype', supertypeId);
  return res.data;
};

export const useVariants = (supertypeId: number | undefined) => {
  return useQuery({
    queryKey: ['deck-variants', supertypeId],
    queryFn: () => fetchVariants(supertypeId),
  });
};

export const useArchetypes = () => {
  return useQuery({ queryKey: ['deck-archetypes'], queryFn: fetchArchetypes });
};

export interface SupertypeSchema {
  id: number;
  name: string;
  defined_pokemon: string[];
  cover_cards: string[];
}

export type DeckClassification = 'archetype' | 'supertype';

export interface DeckTypeSchema extends SupertypeSchema {
  type: DeckClassification;
  supertype?: SupertypeSchema;
  count?: number;
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
    const deck = res.data.at(0);

    if (!deck) return null;

    return {
      id: deck.id,
      name: deck.name,
      supertype: deck.id,
      defined_pokemon: deck.defined_pokemon,
      identifiable_cards: deck.cover_cards,
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
}: {
  name: string;
  supertypeId: number | null;
  pokemon1: string;
  pokemon2: string;
  identifiableCard1: string;
  identifiableCard2: string;
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
  tournamentId: string,
  options?: MostPopularArchetypesOptions
) => {
  const { data: liveResults, isLoading: liveResultsIsLoading } =
    useLiveTournamentResults(tournamentId, {
      load: { allRoundData: true },
    });
  const {
    data: archetypes,
    refetch,
    isLoading: archetypesIsLoading,
  } = useArchetypes();

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
