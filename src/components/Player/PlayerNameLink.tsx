import {
  Link,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export const PlayerNameLink = ({ name, twitterHandle }: { name: string, twitterHandle?: string}) => {
  return twitterHandle ? (
    <Link
      color='blue.600'
      as={NextLink}
      href={`/player/${twitterHandle}`}
    >
      <Text>{name}</Text>
    </Link>
  ) : (
    <Text>{name}</Text>
  )
}