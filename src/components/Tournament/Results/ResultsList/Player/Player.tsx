import { Icon, Link, Stack, Text } from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';
import { memo } from 'react';

export const Player = memo(
  ({ name, twitterUrl }: { name: string; twitterUrl: string }) => {
    return (
      <Stack direction={'row'}>
        <Text>{name}</Text>
        {twitterUrl && (
          <Link color='twitter.500' as={NextLink} href={twitterUrl} isExternal>
            <Icon as={FaTwitter} />
          </Link>
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
