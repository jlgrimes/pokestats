import { Badge, Box, Heading, HStack, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
import { capitalize } from '../../lib/strings';
import {
  getTournamentStatusBadgeProps,
  formatTournamentStatus,
} from '../TournamentList/helpers';
import { TournamentLinks } from './TournamentLinks';
import { TournamentTabs } from './TournamentTabs';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament | null;
}) => {
  const router = useRouter();
  const slug = router.asPath.split('/').at(router.asPath.split('/').length - 1);

  if (!tournament) return null;

  return (
    <Stack spacing={0} flexGrow={1} overflow='hidden'>
      <Stack paddingX={4} paddingY={4}>
        <Heading size='lg' color='gray.700'>
          {`${tournament.name} ${capitalize(slug as string)}`}
        </Heading>
        {/* <Stack>
          <TournamentLinks tournament={tournament} />
          <TournamentTabs tournament={tournament} />
        </Stack> */}
      </Stack>
      {children}
    </Stack>
  );
};
