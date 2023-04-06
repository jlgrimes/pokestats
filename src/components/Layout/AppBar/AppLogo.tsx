import {
  Heading,
  Stack,
  LinkOverlay,
  LinkBox,
  Badge,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { AdminBadge } from '../../common/AdminBadge';

export const AppLogo = ({ smol, big }: { smol?: boolean; big?: boolean }) => {
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
        <LinkOverlay href={`/`} as={NextLink}>
          <HStack spacing={1} alignItems='baseline'>
            <Stack direction={'row'} alignItems='center' spacing={0}>
              {big && (
                <Heading
                  color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}
                  letterSpacing={'wider'}
                  size={big ? 'xl' : smol ? 'sm' : 'md'}
                  fontWeight={'black'}
                  lineHeight={'taller'}
                >
                  pokéstats
                </Heading>
              )}
              <Heading
                letterSpacing={'wider'}
                size={big ? 'xl' : smol ? 'sm' : 'md'}
                fontWeight={'black'}
                color='red.600'
              >
                .live
              </Heading>
            </Stack>
            {/* <Badge>Beta</Badge> */}
          </HStack>
        </LinkOverlay>
      </LinkBox>
      {(userIsAdmin || isUserMocked) && <AdminBadge />}
    </Stack>
  );
};
