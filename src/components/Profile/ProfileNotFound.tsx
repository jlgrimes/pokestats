import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { ComplainLink } from '../common/ComplainLink';

export const ProfileNotFound = () => {
  return (
    <Stack padding='1.5rem' spacing={4}>
      <Stack>
        <Heading color='gray.700'>{`Couldn't find player`}</Heading>
        <Text>{`Make sure you spelled their name right. If you did, it's probably my fault - oops`}</Text>
      </Stack>
      <div>
        <ComplainLink />
      </div>
    </Stack>
  );
}