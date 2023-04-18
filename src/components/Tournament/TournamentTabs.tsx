import { Tabs, TabList, Tab, Badge, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { Tournament } from '../../../types/tournament';

export const TournamentTabs = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const router = useRouter();
    const tabs = [
      {
        name: 'Standings',
        slug: 'standings',
      },
      {
        name: 'Pairings',
        slug: 'pairings',
      },
      ...(tournament.tournamentStatus === 'finished'
        ? [
            {
              name: 'Decks',
              slug: 'decks',
            },
          ]
        : []),
    ];

    return (
      <Tabs
        size='md'
        variant='soft-rounded'
        colorScheme='blue'
        onChange={idx =>
          router.push(`/tournaments/${tournament.id}/${tabs[idx].slug}`)
        }
        defaultIndex={tabs.findIndex(
          ({ slug }) =>
            router.route.substring(router.route.lastIndexOf('/') + 1) === slug
        )}
      >
        <TabList>
          {tabs.map(({ name }, idx) => (
            <Tab key={idx}>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Text whiteSpace={'nowrap'} gap={1}>
                  {name}
                </Text>
              </Stack>
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  }
);

TournamentTabs.displayName = 'TournamentTabs';
