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
import { StoredPlayerProfile } from '../../../../../../types/player';
import supabase from '../../../../../lib/supabase/client';
interface EditPlayerModalProps {
  playerProfile: StoredPlayerProfile;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPlayerModal = memo((props: EditPlayerModalProps) => {
  const toast = useToast();
  const handleSubmit = async ({
    name,
    twitter,
  }: {
    name: string;
    twitter: string;
  }) => {
    const res = await supabase
      .from('Player Profiles')
      .update({ name, twitter_handle: twitter })
      .eq('id', props.playerProfile?.id);

    toast({
      title: 'Successfully updated player!',
      description: 'Refresh page to see updates',
      status: 'success',
    });
    props.onClose();
  };

  const formik = useFormik({
    initialValues: {
      name: props.name,
      twitter: props.playerProfile?.twitterHandle ?? '',
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
                <FormLabel>Twitter username</FormLabel>
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
              Update player information
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
