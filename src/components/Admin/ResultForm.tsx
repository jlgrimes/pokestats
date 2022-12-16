import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { getResultQueryKey } from '../../lib/fetch/query-keys';
import supabase from '../../lib/supabase/client';

interface ResultFormValues {
  player: string;
  deck: string;
  place: number;
}

export default function ResultForm() {
  const queryClient = useQueryClient();

  const addResult = async (values: ResultFormValues) => {
    const result = await supabase.from('Tournament Results').insert([
      {
        place: values.place,
        player_name: values.player,
        deck_archetype: values.deck,
        tournament_name: 'Toronto 2022'
      },
    ]);

    return result;
  };
  const mutation = useMutation(getResultQueryKey('Toronto 2022'), addResult, {
    onSuccess: () => {
      queryClient.invalidateQueries(getResultQueryKey('Toronto 2022'))
    }
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
      <Stack direction={'row'} gap={'0.5rem'} alignItems={'end'}>
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
          <FormLabel>Deck</FormLabel>
          <Input
            name='deck'
            value={formik.values.deck}
            onChange={formik.handleChange}
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
