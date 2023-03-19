import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaCheck, FaCross, FaTimes, FaWindowClose } from 'react-icons/fa';
import * as Yup from 'yup';
import { CombinedPlayerProfile } from '../../../types/player';
import { useSessionUserProfile } from '../../hooks/user';
import supabase from '../../lib/supabase/client';

interface UsernameEditableProps {
  profile: CombinedPlayerProfile;
}

export const UsernameEditable = (props: UsernameEditableProps) => {
  const session = useSession();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { refetch } = useSessionUserProfile();

  const userIsLoggedInUser = session.data?.user?.name === props.profile.name;

  const handleSubmit = async ({
    pokestatsUsername,
  }: {
    pokestatsUsername: string;
  }) => {
    const { error } = await supabase
      .from('Player Profiles')
      .update({ username: pokestatsUsername })
      .match({ name: session.data?.user?.name });

    if (error) {
      return toast({
        status: 'error',
        title: 'Error updating username',
        description: error.message,
      });
    }

    await refetch();
    setIsEditing(false);
    return toast({
      status: 'success',
      title: 'Set your username to ' + pokestatsUsername + '!',
    });
  };

  const formik = useFormik({
    initialValues: {
      pokestatsUsername: '',
    },
    validationSchema: Yup.object().shape({
      pokestatsUsername: Yup.string()
        .required('Required')
        .min(5, 'Username must be at least 5 characters')
        .max(20, 'Username cannot exceed 20 characters')
        .matches(/^[^.]*$/, {
          message: 'No period',
        })
        .matches(/^[^!@#$%^&*+=<>:;|~]*$/, {
          message: 'No symbols',
        }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  });

  if (isEditing)
    return (
      <form onSubmit={formik.handleSubmit}>
        <HStack>
          <FormControl isInvalid={!!formik.errors.pokestatsUsername}>
            <Input
              name='pokestatsUsername'
              value={formik.values.pokestatsUsername}
              onChange={formik.handleChange}
              autoFocus
            />
            {formik.errors.pokestatsUsername ? (
              <FormErrorMessage>
                {formik.errors.pokestatsUsername}
              </FormErrorMessage>
            ) : (
              <Box />
            )}
          </FormControl>
          <IconButton
            aria-label='Submit username'
            icon={<FaCheck />}
            colorScheme='green'
            onClick={formik.submitForm}
          />
          <IconButton
            aria-label='Exit edit'
            icon={<FaTimes />}
            onClick={() => setIsEditing(false)}
          />
        </HStack>
      </form>
    );

  return (
    <>
      {props.profile.username ? (
        <Heading
          size='lg'
          color='gray.500'
          fontWeight='semibold'
        >{`@${props.profile.username}`}</Heading>
      ) : null}
      {userIsLoggedInUser && !props.profile.username && (
        <Button
          size='sm'
          colorScheme={'pink'}
          borderRadius='16'
          onClick={() => setIsEditing(true)}
        >
          Add username
        </Button>
      )}
    </>
  );
};
