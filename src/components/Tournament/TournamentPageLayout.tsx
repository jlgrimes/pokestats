import { Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
import { TournamentTabs } from './TournamentTabs';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament;
}) => {
  return (
    <Stack>
      <Stack spacing={0} paddingBottom={2}>
        <Heading size='lg' color='gray.700' padding={'0.5rem 1.5rem'}>
          {tournament.name}
        </Heading>
        <TournamentTabs tournament={tournament} />
      </Stack>
      {children}
    </Stack>
  );
};
