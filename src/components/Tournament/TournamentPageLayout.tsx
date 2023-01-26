import { Badge, Heading, Stack } from '@chakra-ui/react';
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
  tournament: Tournament;
}) => {
  return (
    <Stack height='100%' spacing={4}>
      <Stack paddingX={4} paddingTop={4}>
        <Heading size='lg' color='gray.700'>
          {tournament.name}
          <Badge {...getTournamentStatusBadgeProps(tournament)} marginLeft={2}>
            {formatTournamentStatus(tournament)}
          </Badge>
        </Heading>
        <TournamentLinks tournament={tournament} />
      </Stack>
      <Stack paddingX={4}>
        <TournamentTabs tournament={tournament} />
      </Stack>
      {children}
    </Stack>
  );
};
