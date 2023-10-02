import {
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Tournament } from '../../../types/tournament';
import { useFixAutoHeight } from '../../hooks/useFixAutoHeight';
import { capitalize } from '../../lib/strings';
import { StatsHeading } from '../common/StatsHeading';
import { PageTitle } from '../common/new/PageTitle';
import { Text } from '@tremor/react';
import { AgeDivisionSelector } from './AgeDivisionSelector';

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
        <PageTitle>
          {`${tournament.name} ${capitalize(slug as string)}`}
        </PageTitle>
        <Text>
          Standings are unofficial and may be inaccurate.
        </Text>
        <AgeDivisionSelector urlConstructor={(division) => `/tournaments/${tournament.id}/${division}/${slug}`} />
        {/* <TournamentStatusBadge tournament={tournament} size='md' /> */}
      </Stack>
      {children}
    </Stack>
  );
};
