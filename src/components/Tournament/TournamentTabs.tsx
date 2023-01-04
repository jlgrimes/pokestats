import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Tournament } from '../../../types/tournament';
import { useSessionUserProfile } from '../../hooks/user';
import { getStandingsBadgeProps } from './helpers';

export const TournamentTabs = ({ tournament }: { tournament: Tournament }) => {
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
    ...(userIsInTournament
      ? [
          {
            name: 'My results',
            slug: 'my-results',
          },
        ]
      : []),
    {
      name: 'Stats',
      slug: 'stats',
    },
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
};
