import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import supabase from "../lib/supabase/client";

export const useMutatePlayerProfiles = (onClose: () => void, playerId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const updatePlayerProfile = async ({
    name,
    twitter
  }: {
    name: string;
    twitter: string
  }) => {
    const result = await supabase
      .from('Deck Archetypes')
      .update([{ name, twitter_profile: twitter }])
      .eq('id', playerId)
    return result;
  };

  const mutation = useMutation('deck-archetypes', updatePlayerProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('deck-archetypes');

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