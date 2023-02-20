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
      defined_pokemon
    )`);

  if (res.data) {
    return res.data.map(archetype => ({
      ...archetype,
      type: 'archetype',
      supertype: Array.isArray(archetype.supertype)
        ? archetype.supertype[0]
        : archetype.supertype ?? {
            id: -1,
            name: archetype.name,
            defined_pokemon: archetype.defined_pokemon,
          },
    }));
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

export const fetchVariants = async (supertypeId: number) => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon')
    .eq('supertype', supertypeId);
  return res.data;
};

export const useVariants = (supertypeId: number) => {
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
}

export interface DeckTypeSchema extends SupertypeSchema {
  type: 'archetype' | 'supertype';
  supertype?: SupertypeSchema;
  count?: number;
}

const fetchSupertypes = async () => {
  const res = await supabase
    .from('Deck Supertypes')
    .select(`id,name,defined_pokemon`);

  if (res.data) {
    return res.data.map(supertype => ({
      ...supertype,
      type: 'supertype',
    }));
  }

  return res.data;
};

export const useSupertypes = () => {
  return useQuery({
    queryKey: ['supertypes'],
    queryFn: () => fetchSupertypes(),
  });
};

const addArchetype = async ({
  name,
  supertype,
  pokemon1,
  pokemon2,
  identifiableCard1,
  identifiableCard2,
}: {
  name: string;
  supertype: string;
  pokemon1: string;
  pokemon2: string;
  identifiableCard1: string;
  identifiableCard2: string;
}) => {
  const result = await supabase.from('Deck Archetypes').insert([
    {
      name,
      supertype,
      defined_pokemon: [pokemon1, pokemon2].filter(
        pokemon => pokemon.length > 0
      ),
      identifiable_cards: [identifiableCard1, identifiableCard2].filter(
        card => card.length > 0
      ),
    },
  ]);
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
    onError: () => {
      toast({
        title: 'Error creating archetype',
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
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { allRoundData: true },
  });
  const { data: archetypes, refetch } = useArchetypes();

  const playerDeckCounts = liveResults?.data?.reduce(
    (acc: Record<string, { deck: Deck; count: number }>, player: Standing) => {
      if (player.deck && player.deck.id) {
        // Adds in supertype
        const playerDeck =
          archetypes?.find(archetype => archetype.id === player.deck?.id) ??
          player.deck;

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
