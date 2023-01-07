import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { useSessionUserProfile } from '../../hooks/user';
import { parseUsername } from '../../lib/strings';
import { getStandingsBadgeProps } from './helpers';

export const TournamentTabs = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const router = useRouter();
    const { data: userProfile } = useSessionUserProfile();
    const userIsInTournament = userProfile?.tournamentHistory?.includes(
      tournament.id as string
    );

    const tabs = [
      {
        name: 'Standings',
        slug: 'standings',
        badge: getStandingsBadgeProps(tournament),
      },
      {
        name: 'Stats',
        slug: 'stats',
      },
      ...(userIsInTournament
        ? [
            {
              name: 'My results',
              slug: parseUsername(userProfile?.email as string),
            },
          ]
        : []),
    ];

    return (
      <Tabs
        size='sm'
        variant='line'
        colorScheme='red'
        onChange={idx =>
          router.push(`/tournaments/${tournament.id}/${tabs[idx].slug}`)
        }
        defaultIndex={tabs.findIndex(
          ({ slug }) =>
            router.asPath.substring(router.asPath.lastIndexOf('/') + 1) === slug
        )}
        padding={'0 1.5rem'}
      >
        <TabList>
          {tabs.map(({ name, badge }, idx) => (
            <Tab key={idx}>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Text>{name}</Text>
                {badge?.children && <Badge variant='subtle' {...badge} />}
              </Stack>
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  }
);

TournamentTabs.displayName = 'TournamentTabs';
