import { Flex, Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
import { RK9TournamentLink } from './RK9TournamentLink';
import { TournamentTabs } from './TournamentTabs';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament;
}) => {
  return (
    <Stack height='100%'>
      <Stack spacing={0} paddingBottom={2}>
        <Heading size='lg' color='gray.700' padding={'0.5rem 1.5rem'}>
          {tournament.name}
          <RK9TournamentLink tournament={tournament} />
        </Heading>
        <TournamentTabs tournament={tournament} />
      </Stack>
      {children}
    </Stack>
  );
};
