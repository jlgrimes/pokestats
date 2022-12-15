import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';

export default function PlayerInputForm() {
  const handleSubmit = (values: { player: string; deck: string }) => {
    formik.resetForm();
    
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
        <Stack direction={'row'} gap={'0.5rem'} alignItems={'end'}>
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