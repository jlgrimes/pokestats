import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const TournamentTabs = () => {
  const router = useRouter();
  const tournamentId = router.query.id;
  const tabs = [
    {
      name: 'Standings',
      slug: 'standings',
    },
    {
      name: 'Stats',
      slug: 'stats',
    },
  ];

  return (
    <Tabs
      variant='soft-rounded'
      colorScheme='green'
      onChange={idx =>
        router.push(`/tournaments/${tournamentId}/${tabs[idx].slug}`)
      }
      defaultIndex={tabs.findIndex(({ slug }) => router.asPath.substring(router.asPath.lastIndexOf('/') + 1) === slug)}
      padding={'1.5rem 1.5rem 0'}
    >
      <TabList>
        {tabs.map(({ name }, idx) => (
          <Tab key={idx}>{name}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
