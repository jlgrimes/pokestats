import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import supabase from '../../../lib/supabase/client';

interface AddArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddArchetypeModal(props: AddArchetypeModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

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

  const mutation = useMutation('deck-archetypes', addArchetype, {
    onSuccess: () => {
      queryClient.invalidateQueries('deck-archetypes');

      toast({
        title: 'Successfully created archetype!',
        status: 'success',
      });
      props.onClose();
    },
    onError: () => {
      toast({
        title: 'Error creating archetype',
        status: 'error',
      });
    },
  });

  const handleSubmit = async ({
    name,
    pokemon1,
    pokemon2,
  }: {
    name: string;
    pokemon1: string;
    pokemon2: string;
  }) => {
    mutation.mutate({ name, pokemon1, pokemon2 });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      pokemon1: '',
      pokemon2: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>Add archetype</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <FormControl>
                <FormLabel>Archetype name</FormLabel>
                <Input
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>First pokemon in sprite</FormLabel>
                <Input
                  name='pokemon1'
                  value={formik.values.pokemon1}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Second pokemon in sprite</FormLabel>
                <Input
                  name='pokemon2'
                  value={formik.values.pokemon2}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} type='submit'>
              Add archetype
            </Button>
            <Button variant='ghost' onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
