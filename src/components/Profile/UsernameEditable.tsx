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
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaCheck, FaCross, FaTimes, FaWindowClose } from 'react-icons/fa';
import * as Yup from 'yup';
import { CombinedPlayerProfile } from '../../../types/player';
import { useAllTakenUsernames, useSessionUserProfile } from '../../hooks/user';
import supabase from '../../lib/supabase/client';
import { Username } from './Username';
import { profanity } from '@2toad/profanity';

interface UsernameEditableProps {
  profile: CombinedPlayerProfile;
}

export const UsernameEditable = (props: UsernameEditableProps) => {
  const session = useSession();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { refetch } = useSessionUserProfile();
  const router = useRouter();
  const { data: takenUsernames } = useAllTakenUsernames();

  const userIsLoggedInUser = session.data?.user?.name === props.profile.name;

  const handleSubmit = async ({
    pokestatsUsername,
  }: {
    pokestatsUsername: string;
  }) => {
    if (profanity.exists(pokestatsUsername)) {
      return toast({
        status: 'error',
        title: 'Watch your mouth!',
      });
    }

    if (takenUsernames?.some(username => username === pokestatsUsername)) {
      return toast({
        status: 'error',
        title: 'That username is taken! Try another one',
      });
    }

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

    router.push(`/player/${pokestatsUsername}`);
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
          message: 'No period allowed',
        })
        .matches(/^[^ ]*$/, {
          message: 'No spaces allowed',
        })
        .matches(/^[^!@#$%^&*+=<>:;|~]*$/, {
          message: 'No symbols allowed',
        }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  });

  if (isEditing)
    return (
      <form onSubmit={formik.handleSubmit}>
        <HStack alignItems={'baseline'}>
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
        <Username>{props.profile.username}</Username>
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
