import {
  Stack,
  useColorMode,
  Switch
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';
import { Tournament } from '../../../types/tournament';
import { useFixAutoHeight } from '../../hooks/useFixAutoHeight';
import { capitalize } from '../../lib/strings';
import { StatsHeading } from '../common/StatsHeading';
import { PageTitle } from '../common/new/PageTitle';
import { Bold, Flex, Subtitle, Text, TextInput } from '@tremor/react';
import { AgeDivisionSelector } from './AgeDivisionSelector';
import { StandingsPageContext } from '../../../pages/tournaments/[id]/[division]/standings';
import { shortenTournamentName } from '../../lib/tournament';
import { Ad } from '../Ad';
import { trackEvent } from '../../lib/track';
import { SearchIcon } from '@heroicons/react/outline';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: Tournament | null;
}) => {
  useFixAutoHeight();
  const { colorMode } = useColorMode();
  const { setShouldShowMatchPoints, setNameFilter } = useContext(StandingsPageContext);

  const router = useRouter();
  const splitPath: string[] = router.route ? router.route.split('/') : [];
  const slug = splitPath ? splitPath[splitPath.length - 1] : '/';

  if (!tournament) return null;

  return (
    <Stack spacing={0} height='100%' overflow='hidden' id='tournament-page-layout'>
      <Stack paddingTop={2} spacing={1}>
        <Ad slot='3745883635' height='50px' />
        <h1 className="text-xl font-bold leading-snug text-slate-700 dark:text-slate-300 ml-1">
          {`${shortenTournamentName(tournament)} ${capitalize(slug as string)}`}
        </h1>
        <Subtitle className='ml-1'>Standings are unofficial and may be inaccurate.</Subtitle>
        <Flex className='gap-2'>
          <div>
            <AgeDivisionSelector urlConstructor={(division) => `/tournaments/${tournament.id}/${division}/${slug}`} />
          </div>
          <div className='flex gap-2'>
            <Text className='text-xs'>
              Match points
            </Text>
            <Switch onChange={e => {
              trackEvent('Show match points in standings toggled', { value: e.currentTarget.checked })
              setShouldShowMatchPoints(e.currentTarget.checked);
            }} />
          </div>
        </Flex>
        <TextInput icon={SearchIcon} placeholder='Search a player' onClick={() => trackEvent('Search player input clicked')} onKeyUp={(e) => setNameFilter((e.target as HTMLInputElement).value)} />
        {/* <TournamentStatusBadge tournament={tournament} size='md' /> */}
      </Stack>
      {children}
    </Stack>
  );
};
