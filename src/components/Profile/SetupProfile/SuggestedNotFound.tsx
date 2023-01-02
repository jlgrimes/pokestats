import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useMemo } from 'react';
import { ComplainLink } from '../../common/ComplainLink';
import { getFirstName } from '../helpers';

export const SuggestedNotFound = ({ session }: { session: Session }) => {
  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Heading color='gray.700'>Complete account setup</Heading>
      <Text>{`Please send us a request to finish account setup.`}</Text>
      <ComplainLink />
    </Stack>
  );
};
