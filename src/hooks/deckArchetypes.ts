import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchArchetypes = async () => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon,supertype');
  return res.data;
};

export const fetchArchetype = async (archetypeId: number) => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon,identifiable_cards,supertype')
    .eq('id', archetypeId);
  return res.data?.[0];
};

export const fetchVariants = async (supertype: string) => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon')
    .eq('supertype', supertype);
  return res.data;
};

export const useVariants = (supertype: string) => {
  return useQuery({
    queryKey: ['deck-variants', supertype],
    queryFn: () => fetchVariants(supertype),
  });
};

export const useArchetypes = () => {
  return useQuery({ queryKey: ['deck-archetypes'], queryFn: fetchArchetypes });
};

const addArchetype = async ({
  name,
  pokemon1,
  pokemon2,
}: {
  name: string;
  pokemon1: string;
  pokemon2: string;
}) => {
  const result = await supabase
    .from('Deck Archetypes')
    .insert([{ name, defined_pokemon: [pokemon1, pokemon2] }]);
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
  leaveOutZeroCountDecks?: boolean;
  includeDeckCounts?: boolean;
}

export const useMostPopularArchetypes = (
  tournamentId: string,
  options?: MostPopularArchetypesOptions
): Deck[] | null | undefined => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { allRoundData: true },
  });
  const { data: archetypes } = useArchetypes();

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
    return null;
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

  return sortedArchetypes.map(({ deck }) => deck);
};
