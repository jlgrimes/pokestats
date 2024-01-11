import {
  Heading,
  Stack,
  LinkOverlay,
  LinkBox,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { AdminBadge } from '../../common/AdminBadge';
import { Badge, Bold } from '@tremor/react';
import { trackEvent } from '../../../lib/track';

export const AppLogo = ({ smol, big, vgc }: { smol?: boolean; big?: boolean, vgc?: boolean }) => {
  const { colorMode } = useColorMode();

  const { data: userIsAdmin, isUserMocked } = useUserIsAdmin();

  return (
    <Stack
      direction='row'
      spacing={1}
      alignItems='baseline'
      justifyContent={'center'}
    >
      <LinkBox>
        <LinkOverlay href={`/`} as={NextLink} onClick={() => trackEvent('App bar logo clicked')}>
          <HStack spacing={1} alignItems='baseline'>
            <Stack direction={'row'} alignItems='baseline' spacing={0}>
              <Heading
                color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}
                letterSpacing={'wider'}
                size={big ? 'xl' : smol ? 'sm' : 'md'}
                fontWeight={'black'}
                lineHeight={'taller'}
              >
                pokéstats
              </Heading>
              <Heading
                letterSpacing={'wider'}
                size={big ? 'xl' : smol ? 'sm' : 'md'}
                fontWeight={'black'}
                color='red.600'
              >
                .live
              </Heading>
            </Stack>
            {process.env['NEXT_PUBLIC_ENV'] === 'staging' && (
              <Badge color='amber'>Beta</Badge>
            )}
          </HStack>
        </LinkOverlay>
      </LinkBox>
      {(userIsAdmin || isUserMocked) && <AdminBadge />}
    </Stack>
  );
};
