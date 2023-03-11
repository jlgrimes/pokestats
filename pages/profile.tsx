import { Button, Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaArrowRight, FaHistory, FaRegClock } from 'react-icons/fa';
import { PlayerPerformanceList } from '../src/components/DataDisplay/PlayerPerformanceList';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { getFirstName } from '../src/components/Profile/helpers';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults/fetch';
import { fetchTournaments } from '../src/hooks/tournaments';
import { useSessionUserProfile } from '../src/hooks/user';
import { parseUsername } from '../src/lib/strings';
import { Tournament } from '../types/tournament';

export default function ProfilePage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const session = useSession();
  const router = useRouter();
  const { data: user, isLoading } = useSessionUserProfile();

  useEffect(() => {
    // If user is on the page with their profile, and there is not a profile stored
    if (session.status === 'authenticated' && !isLoading && !user) {
      router.push('/setup-profile');
    }

    if (session.status === 'unauthenticated') {
      router.push('/');
    }
  }, [session.status, router, user, isLoading]);

  return <PlayerPerformanceList user={user} />;
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });
  await queryClient.prefetchQuery({
    queryKey: ['decks-with-lists'],
    queryFn: () => fetchDecksWithLists(),
  });

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
