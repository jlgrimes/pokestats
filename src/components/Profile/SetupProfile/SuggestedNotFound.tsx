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
  const firstName = useMemo(() => getFirstName(session), [session]);

  return (
    <Stack padding='1.5rem' spacing={4}>
      <Stack>
        <Heading color='gray.700'>{`Welcome to Stats${
          firstName ? `, ${firstName}` : ''
        }!`}</Heading>
        <Text>{`Unfortunately we don't have an account set up for you yet. We want to make this right.`}</Text>
      </Stack>
      <div>
        <ComplainLink />
      </div>
    </Stack>
  );
};
