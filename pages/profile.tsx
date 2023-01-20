import { Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults';
import { fetchTournaments } from '../src/hooks/tournaments';
import { Tournament } from '../types/tournament';

export default function ProfilePage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is on the page with their profile, and there is not a profile stored
    if (session.status === 'unauthenticated') {
      router.push('/setup-profile');
    }
  }, [session.status, router]);

  return (
    <Stack>
      <Heading>Hi, Jared!</Heading>
      <MyMostRecentResults tournaments={tournaments} />
    </Stack>
  );
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
    revalidate: 60,
  };
}
