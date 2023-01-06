import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Tournament } from '../../../types/tournament';
import { getStandingsBadgeProps } from './helpers';

export const TournamentTabs = ({ tournament }: { tournament: Tournament }) => {
  const router = useRouter();
  const tabs = [
    {
      name: 'Standings',
      slug: 'standings',
      badge: getStandingsBadgeProps(tournament),
    },
    ...(router.asPath.includes('my-results')
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
