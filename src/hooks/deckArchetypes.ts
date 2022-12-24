import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const useArchetypes = () => {
  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Deck Archetypes')
      .select('name,defined_pokemon');
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
