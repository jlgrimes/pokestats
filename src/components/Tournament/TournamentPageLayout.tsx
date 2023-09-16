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
import { useFixAutoHeight } from '../../hooks/useFixAutoHeight';
import { capitalize } from '../../lib/strings';
import { StatsHeading } from '../common/StatsHeading';
import { TournamentStatusBadge } from '../TournamentList/TournamentStatusCallout';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament | null;
}) => {
  useFixAutoHeight();
  const { colorMode } = useColorMode();

  const router = useRouter();
  const splitPath: string[] = router.route ? router.route.split('/') : [];
  const slug = splitPath ? splitPath[splitPath.length - 1] : '/';

  if (!tournament) return null;

  return (
    <Stack spacing={0} height='100%' overflow='hidden' id='tournament-page-layout'>
      <Stack paddingX={4} paddingTop={2} spacing={1}>
        <StatsHeading
          headingProps={{ color: colorMode === 'dark' ? 'gray.100' : 'gray.700'}}
        >
          {`${tournament.name} ${capitalize(slug as string)}`}
        </StatsHeading>
        <Text fontSize='sm'>
          Standings are unofficial and may be inaccurate.
        </Text>
        {/* <TournamentStatusBadge tournament={tournament} size='md' /> */}
      </Stack>
      {children}
    </Stack>
  );
};
