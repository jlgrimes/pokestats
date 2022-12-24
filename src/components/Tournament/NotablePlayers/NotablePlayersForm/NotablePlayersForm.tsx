import { Button, FormControl, FormLabel, Input, Stack, useDisclosure } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotablePlayersQueryKey } from '../../../../lib/fetch/query-keys';
import supabase from '../../../../lib/supabase/client';
import ArchetypeSelector from '../../Results/ResultsList/DeckInput/ArchetypeSelector/ArchetypeSelector';

interface NotablePlayerFormValues {
  player: string;
  deck: string;
}

export default function NotablePlayersForm({ tournament }: { tournament: string }) {
  const queryClient = useQueryClient();

  const addNotablePlayer = async (values: NotablePlayerFormValues) => {
    const result = await supabase.from('Notable Players').insert([
      {
        player_name: values.player,
        deck_archetype: values.deck,
        tournament_name: tournament,
      },
    ]);

    return result;
  };
  const mutation = useMutation([getNotablePlayersQueryKey(tournament)], addNotablePlayer, {
    onSuccess: () => {
      queryClient.invalidateQueries([getNotablePlayersQueryKey(tournament)]);
    },
  });

  const handleSubmit = (values: NotablePlayerFormValues) => {
    formik.resetForm();
    mutation.mutate(values);
  };

  const formik = useFormik({
    initialValues: {
      player: '',
      deck: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack direction={{ base: 'column', sm: 'row' }} gap={'0.5rem'} alignItems={'end'}>
        <FormControl>
          <FormLabel>Player name</FormLabel>
          <Input
            name='player'
            value={formik.values.player}
            onChange={formik.handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Deck archetype</FormLabel>
          <ArchetypeSelector
            value={formik.values.deck}
            onChange={(value) => formik.setFieldValue('deck', value)}
          />
        </FormControl>
        <div>
          <Button colorScheme='teal' variant='solid' type='submit'>
            Submit
          </Button>
        </div>
      </Stack>
    </form>
  );
}