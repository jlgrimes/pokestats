import {
  Badge,
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
import { capitalize } from '../../lib/strings';
import { TournamentStatusBadge } from '../TournamentList/TournamentStatusBadge';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament | null;
}) => {
  const { colorMode } = useColorMode();

  const router = useRouter();
  const splitPath: string[] = router.route ? router.route.split('/') : [];
  const slug = splitPath ? splitPath[splitPath.length - 1] : '/';

  if (!tournament) return null;

  return (
    <Stack spacing={0} height='100%' overflow='hidden'>
      <Stack paddingX={4} paddingTop={4} paddingBottom={2}>
        <Heading
          size='lg'
          color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
        >
          {`${tournament.name} ${capitalize(slug as string)}`}
        </Heading>
        <Text fontSize='sm'>
          Standings are unofficial and may not be accurate.
        </Text>
        {/* <TournamentStatusBadge tournament={tournament} size='md' /> */}
      </Stack>
      {children}
    </Stack>
  );
};
