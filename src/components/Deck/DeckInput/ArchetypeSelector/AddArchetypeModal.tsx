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
  Grid,
  Text,
  Image,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutateArchetypes } from '../../../../hooks/deckArchetypes';
import * as Yup from 'yup';
import { getSpriteUrl } from '../../../common/helpers';
import { useIsMobile } from '../../../../hooks/device';

interface AddArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleArchetypeChange?: (name: string) => void;
}

export default function AddArchetypeModal(props: AddArchetypeModalProps) {
  const mutateArchetypes = useMutateArchetypes(props.onClose);
  const isMobile = useIsMobile();

  const handleSubmit = async ({
    name,
    pokemon1,
    pokemon2,
    identifiableCard1,
    identifiableCard2,
  }: {
    name: string;
    pokemon1: string;
    pokemon2: string;
    identifiableCard1: string;
    identifiableCard2: string;
  }) => {
    await mutateArchetypes.mutate({
      name,
      pokemon1,
      pokemon2,
      identifiableCard1,
      identifiableCard2,
    });
    props.handleArchetypeChange && props.handleArchetypeChange(name);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      pokemon1: '',
      pokemon2: '',
      identifiableCard1: '',
      identifiableCard2: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Required'),
      pokemon1: Yup.string().required('Required'),
      identifiableCard1: Yup.string().required('Required'),
      identifiableCard2: Yup.string().required('Required'),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent margin={isMobile ? 'auto' : 0}>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>Add archetype</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <FormControl
                isInvalid={!!(formik.errors.name && formik.touched.name)}
              >
                <Input
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder='Archetype name'
                />
              </FormControl>
              <FormLabel>Pokémon to be displayed as sprites</FormLabel>
              <Text fontSize='sm'>
                These come from Limitless. Verify the Pokémon shows how you want
                it here before submitting. Type in <b>lowercase</b>.
              </Text>
              <Grid gridTemplateColumns={'1fr 1fr'} gap={2}>
                <FormControl
                  isInvalid={
                    !!(formik.errors.pokemon1 && formik.touched.pokemon1)
                  }
                >
                  <Stack>
                    <Input
                      name='pokemon1'
                      value={formik.values.pokemon1}
                      onChange={formik.handleChange}
                      placeholder='First Pokémon *'
                      isRequired
                    />
                    <div>
                      <Image
                        className='pixel-image'
                        height='50px'
                        width='auto'
                        alt={formik.values.pokemon1}
                        src={getSpriteUrl(formik.values.pokemon1)}
                      />
                    </div>
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack>
                    <Input
                      name='pokemon2'
                      value={formik.values.pokemon2}
                      onChange={formik.handleChange}
                      placeholder='Second Pokémon'
                    />
                    <div>
                      <Image
                        className='pixel-image'
                        height='50px'
                        width='auto'
                        alt={formik.values.pokemon2}
                        src={getSpriteUrl(formik.values.pokemon2)}
                      />
                    </div>
                  </Stack>
                </FormControl>
              </Grid>
              <FormLabel>Identifiable Cards</FormLabel>
              <Text fontSize='sm'>
                Pick cards that are in this specific archetype that define it.
                For example, a deck with Palkia and Inteleon should be
                classified as Palkia Inteleon. This is used for classifying
                decks when lists are made public.
              </Text>
              <Text fontSize='sm'>
                Please type the full name of the card in each field using{' '}
                <b>capital case</b>. Ex. <b>Origin Forme Palkia VSTAR</b>{' '}
                instead of Palkia VSTAR.
              </Text>
              <Grid gridTemplateColumns={'1fr 1fr'} gap={2}>
                <FormControl
                  isInvalid={
                    !!(
                      formik.errors.identifiableCard1 &&
                      formik.touched.identifiableCard1
                    )
                  }
                >
                  <Input
                    name='identifiableCard1'
                    value={formik.values.identifiableCard1}
                    onChange={formik.handleChange}
                    placeholder='First card *'
                  />
                </FormControl>
                <FormControl
                  isInvalid={
                    !!(
                      formik.errors.identifiableCard2 &&
                      formik.touched.identifiableCard2
                    )
                  }
                >
                  <Input
                    name='identifiableCard2'
                    value={formik.values.identifiableCard2}
                    onChange={formik.handleChange}
                    placeholder='Second card *'
                  />
                </FormControl>
              </Grid>
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
