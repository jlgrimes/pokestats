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
import { memo } from 'react';
import { useMutatePlayerProfiles } from '../../../../../hooks/playerProfiles';

interface EditPlayerModalProps {
  playerProfile: { playerId: number, twitterUrl: string } | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPlayerModal = memo((props: EditPlayerModalProps) => {
  const mutatePlayerProfiles = useMutatePlayerProfiles(props.onClose, props.playerProfile?.playerId);

  const handleSubmit = async ({
    name,
    twitter
  }: {
    name: string;
    twitter: string
  }) => {
    await mutatePlayerProfiles.mutate({ name, twitter });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      twitter: props.playerProfile?.twitterUrl ?? ''
    },
    onSubmit: handleSubmit,
  });

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>Edit player</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Twitter profile URL</FormLabel>
                <Input
                  name='twitter'
                  value={formik.values.twitter}
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
});

EditPlayerModal.displayName = 'EditPlayerModal';
