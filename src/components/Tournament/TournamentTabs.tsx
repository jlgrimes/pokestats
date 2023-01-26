import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { useSessionUserProfile, useUserIsInTournament } from '../../hooks/user';
import { parseUsername } from '../../lib/strings';

export const TournamentTabs = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const router = useRouter();
    const { data: userProfile } = useSessionUserProfile();
    const userIsInTournament = useUserIsInTournament(
      tournament.id,
      userProfile?.name
    );

    const tabs = [
      {
        name: 'Standings',
        slug: 'standings',
      },
      ...(tournament.tournamentStatus === 'finished'
        ? [
            {
              name: 'Stats',
              slug: 'stats',
            },
          ]
        : []),
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
      >
        <TabList>
          {tabs.map(({ name }, idx) => (
            <Tab key={idx}>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Text>{name}</Text>
              </Stack>
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  }
);

TournamentTabs.displayName = 'TournamentTabs';
