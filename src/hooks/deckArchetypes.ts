import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeckArchetype, Standing } from '../../types/tournament';
import { fetchPlayerDecks } from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchArchetypes = async () => {
  const res = await supabase
    .from('Deck Archetypes')
    .select('id,name,defined_pokemon');
  return res.data;
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
): DeckArchetype[] | null | undefined => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId);

  const playerDeckCounts = liveResults?.data?.reduce(
    (
      acc: Record<string, { deck: DeckArchetype; count: number }>,
      player: Standing
    ) => {
      if (player.deck.id) {
        if (acc[player.deck.id]) {
          return {
            ...acc,
            [player.deck.id]: {
              deck: player.deck,
              count: acc[player.deck.id].count + 1,
            },
          };
        }
        return {
          ...acc,
          [player.deck.id]: {
            deck: player.deck,
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
