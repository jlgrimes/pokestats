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
  HStack,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  forwardRef,
  useDisclosure,
  Box,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import {
  DeckTypeSchema,
  useMutateArchetypes,
  useSupertypes,
} from '../../../../hooks/deckArchetypes';
import * as Yup from 'yup';
import { getSpriteUrl } from '../../../common/helpers';
import { useIsMobile } from '../../../../hooks/device';
import { Fragment, useRef } from 'react';

interface AddArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleArchetypeChange?: (name: string) => void;
}

export default function AddArchetypeModal(props: AddArchetypeModalProps) {
  const { data: supertypes } = useSupertypes();
  const mutateArchetypes = useMutateArchetypes(props.onClose);
  const isMobile = useIsMobile();

  const handleSubmit = async ({
    name,
    supertype,
    pokemon1,
    pokemon2,
    identifiableCard1,
    identifiableCard2,
  }: {
    name: string;
    supertype: string;
    pokemon1: string;
    pokemon2: string;
    identifiableCard1: string;
    identifiableCard2: string;
  }) => {
    await mutateArchetypes.mutate({
      name,
      supertype,
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
      supertype: '',
      pokemon1: '',
      pokemon2: '',
      identifiableCard1: '',
      identifiableCard2: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Required'),
      supertype: Yup.string().required('Required'),
      pokemon1: Yup.string().required('Required'),
      identifiableCard1: Yup.string().required('Required'),
      identifiableCard2: Yup.string().required('Required'),
    }),
    onSubmit: handleSubmit,
  });

  const filteredSupertypes =
    formik.values.supertype.length > 0
      ? supertypes?.filter(supertype =>
          supertype.name
            .toLowerCase()
            .includes(formik.values.supertype.toLowerCase())
        )
      : [];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const supertypeRef = useRef(null);

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
                  placeholder='Archetype name (ex. Lost Box Kyogre) *'
                  autoFocus
                />
              </FormControl>
              {/* <FormControl
                isInvalid={!!(formik.errors.name && formik.touched.name)}
              >
                <Input
                  name='supertype'
                  value={formik.values.supertype}
                  onChange={formik.handleChange}
                  placeholder='Supertype name (ex. Lost Box) *'
                  ref={supertypeRef}
                />
              </FormControl> */}
              <Box ref={supertypeRef} position='relative'>
                <Input
                  name='supertype'
                  value={formik.values.supertype}
                  onChange={formik.handleChange}
                  placeholder='Supertype name (ex. Lost Box) *'
                  onFocus={onOpen}
                  onBlur={() => window.setTimeout(() => onClose(), 100)}
                />
                <Box
                  position='absolute'
                  visibility={isOpen ? 'visible' : 'hidden'}
                  zIndex={5000}
                >
                  {filteredSupertypes?.map(supertype => (
                    <Card key={supertype.name} borderRadius={0}>
                      <CardBody
                        paddingX={4}
                        paddingY={3}
                        onClick={() => {
                          formik.setFieldValue('supertype', supertype);
                          onClose();
                        }}
                      >
                        {supertype.name}
                      </CardBody>
                    </Card>
                  ))}
                </Box>
              </Box>
              <FormLabel>Pokémon to be displayed as sprites</FormLabel>
              <Text fontSize='sm'>
                Verify the Pokémon shows how you want it here before submitting.
                Type in <b>lowercase</b>.
              </Text>
              <FormControl
                isInvalid={
                  !!(formik.errors.pokemon1 && formik.touched.pokemon1)
                }
              >
                <Grid templateColumns={'4fr 1fr'} gap={4}>
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
                      height='35px'
                      width='auto'
                      alt={formik.values.pokemon1}
                      src={getSpriteUrl(formik.values.pokemon1)}
                    />
                  </div>
                </Grid>
              </FormControl>
              <FormControl>
                <Grid templateColumns={'4fr 1fr'} gap={4}>
                  <Input
                    name='pokemon2'
                    value={formik.values.pokemon2}
                    onChange={formik.handleChange}
                    placeholder='Second Pokémon'
                  />
                  <div>
                    <Image
                      className='pixel-image'
                      height='35px'
                      width='auto'
                      alt={formik.values.pokemon2}
                      src={getSpriteUrl(formik.values.pokemon2)}
                    />
                  </div>
                </Grid>
              </FormControl>
              <FormLabel>Identifiable Cards</FormLabel>
              <Text fontSize='sm'>
                Enter card names in capital case that explicitly define the
                archetype. Ex. <b>Origin Forme Palkia VSTAR, Inteleon</b>.
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
