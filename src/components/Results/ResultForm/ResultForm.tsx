import { Button, FormControl, FormLabel, Input, Stack, useDisclosure } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { getResultQueryKey } from '../../../lib/fetch/query-keys';
import supabase from '../../../lib/supabase/client';
import ArchetypeAutocomplete from './ArchetypeSelector';

interface ResultFormValues {
  player: string;
  deck: string;
  place: number;
}

export default function ResultForm({ tournament }: { tournament: string }) {
  const queryClient = useQueryClient();

  const addResult = async (values: ResultFormValues) => {
    const result = await supabase.from('Tournament Results').insert([
      {
        place: values.place,
        player_name: values.player,
        deck_archetype: values.deck,
        tournament_name: tournament,
      },
    ]);

    return result;
  };
  const mutation = useMutation(getResultQueryKey(tournament), addResult, {
    onSuccess: () => {
      queryClient.invalidateQueries(getResultQueryKey(tournament));
    },
  });

  const handleSubmit = (values: ResultFormValues) => {
    formik.resetForm();
    mutation.mutate(values);
  };

  const formik = useFormik({
    initialValues: {
      player: '',
      deck: '',
      place: 1,
    },
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack direction={{ base: 'column', sm: 'row' }} gap={'0.5rem'} alignItems={'end'}>
        <FormControl>
          <FormLabel>Place</FormLabel>
          <Input
            name='place'
            value={formik.values.place}
            onChange={formik.handleChange}
          />
        </FormControl>
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
          <ArchetypeAutocomplete
            value={formik.values.deck}
            onChange={formik.setFieldValue}
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
