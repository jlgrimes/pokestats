import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';

export const TournamentTabs = () => {
  const router = useRouter();
  const session = useSession();

  const tournamentId = router.query.id;
  const routerSlug = router.asPath.split(`${tournamentId}/`)[1];

  const { data: liveResults } = useLiveTournamentResults(
    tournamentId as string
  );
  const userIsInTournament = liveResults?.data.some(
    player => player.name === session.data?.user.name
  );

  const tabs = [
    {
      name: 'Standings',
      slug: 'standings',
      badge: liveResults?.live
        ? `Live - Round ${liveResults?.roundNumber}`
        : false,
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
      variant='soft-rounded'
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
        {tabs.map(({ name, badge, slug }, idx) => (
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
