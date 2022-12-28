import { Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { LoggedInPlayerStatus } from './Results/LoggedInPlayerStatus';
import { TournamentTabs } from './TournamentTabs';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: { id: string; name: string };
}) => {
  return (
    <Stack spacing={1}>
      <Heading size='lg' color='gray.700' padding={'0 1.5rem 0'}>
        {tournament.name}
      </Heading>
      <TournamentTabs />
      {children}
    </Stack>
  );
};
