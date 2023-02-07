import { Badge, Box, Heading, HStack, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
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
  if (!tournament) return null;

  return (
    <Stack spacing={0} flexGrow={1} overflow='hidden'>
      <Stack paddingX={4} paddingTop={2}>
        <Heading size='lg' color='gray.700'>
          {tournament.name}
        </Heading>
        <HStack flexWrap={'wrap'} spacing={0}>
          <TournamentTabs tournament={tournament} />
          <TournamentLinks tournament={tournament} />
        </HStack>
      </Stack>
      {children}
    </Stack>
  );
};
