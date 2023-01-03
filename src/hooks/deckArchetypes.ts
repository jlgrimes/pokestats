import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPlayerDecks } from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';

export const useArchetypes = () => {
  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Deck Archetypes')
      .select('id,name,defined_pokemon');
    return res.data;
  };

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

export const useMostPopularArchetypes = (tournamentId: string) => {
  const { data: deckArchetypes } = useArchetypes();

  const playerDecks = useQuery({
    queryKey: ['player-decks', tournamentId],
    queryFn: () => fetchPlayerDecks(tournamentId),
  });

  const playerDeckCounts: Record<string, number> | undefined =
    playerDecks.data?.reduce((acc: Record<string, number>, playerDeck) => {
      if (acc[playerDeck.id]) {
        return {
          ...acc,
          [playerDeck.id]: acc[playerDeck.id] + 1,
        };
      }
      return {
        ...acc,
        [playerDeck.id]: 1,
      };
    }, {});

  if (!playerDeckCounts) {
    return deckArchetypes;
  }

  return deckArchetypes?.sort((a, b) => {
    if (playerDeckCounts[a.name] > playerDeckCounts[b.name] || !playerDeckCounts[b.name]) {
      return -1;
    }

    if (playerDeckCounts[a.name] < playerDeckCounts[b.name] || !playerDeckCounts[a.name]) {
      return 1;
    }

    return 0;
  });
};
