import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';

export const TournamentTabs = () => {
  const router = useRouter();
  const tournamentId = router.query.id;
  const { data: liveResults } = useLiveTournamentResults(
    tournamentId as string
  );

  const tabs = [
    {
      name: 'Standings',
      slug: 'standings',
      badge: liveResults?.live
        ? `Live - Round ${liveResults?.roundNumber}`
        : false,
    },
    ...(!liveResults?.live
      ? [
          {
            name: 'Stats',
            slug: 'stats',
          },
        ]
      : []),
  ];

  return (
    <Tabs
      variant='enclosed'
      onChange={idx =>
        router.push(`/tournaments/${tournamentId}/${tabs[idx].slug}`)
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
            <Stack direction={'row'} alignItems={'center'}>
              <Text>{name}</Text>
              {badge && (
                <Badge variant='subtle' colorScheme='green'>
                  {badge}
                </Badge>
              )}
            </Stack>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
