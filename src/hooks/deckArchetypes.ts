import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPlayerDecks } from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';

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

export const useMostPopularArchetypes = (tournamentId: string) => {
  const { data: deckArchetypes } = useArchetypes();

  const playerDecks = useQuery({
    queryKey: ['player-decks', tournamentId],
    queryFn: () => fetchPlayerDecks(tournamentId),
  });

  const playerDeckCounts: Record<string, number> | undefined =
    playerDecks.data?.reduce((acc: Record<string, number>, playerDeck) => {
      if (acc[playerDeck.deck_archetype]) {
        return {
          ...acc,
          [playerDeck.deck_archetype]: acc[playerDeck.deck_archetype] + 1,
        };
      }
      return {
        ...acc,
        [playerDeck.deck_archetype]: 1,
      };
    }, {});

  if (!playerDeckCounts) {
    return deckArchetypes;
  }

  return deckArchetypes?.sort((a, b) => {
    if (
      playerDeckCounts[a.id] > playerDeckCounts[b.id] ||
      !playerDeckCounts[b.id]
    ) {
      return -1;
    }

    if (
      playerDeckCounts[a.id] < playerDeckCounts[b.id] ||
      !playerDeckCounts[a.id]
    ) {
      return 1;
    }

    return 0;
  });
};
