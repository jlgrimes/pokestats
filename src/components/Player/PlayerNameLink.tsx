import {
  Link,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { parseUsername } from '../../lib/strings';

export const PlayerNameLink = ({ name, email }: { name: string, email?: string}) => {
  return email ? (
    <Link
      color='blue.600'
      as={NextLink}
      href={`/player/${parseUsername(email)}`}
    >
      <Text fontSize='sm'>{name}</Text>
    </Link>
  ) : (
    <Text fontSize='sm'>{name}</Text>
  )
}