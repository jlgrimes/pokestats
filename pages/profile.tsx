import { Button, Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { MyMostRecentResults } from '../src/components/Home/MyMostRecentResults';
import { getFirstName } from '../src/components/Profile/helpers';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchDecksWithLists } from '../src/hooks/finalResults';
import { fetchTournaments } from '../src/hooks/tournaments';
import { parseUsername } from '../src/lib/strings';
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
      <Heading color='gray.700' padding={2}>
        Hi, {getFirstName(session.data)}!
      </Heading>
      <MyMostRecentResults tournaments={tournaments} />
      <Button
        variant={'outline'}
        rightIcon={<FaArrowRight />}
        onClick={() =>
          session.data?.user.email &&
          router.push('/player/' + parseUsername(session.data?.user.email))
        }
      >
        See my tournament history
      </Button>
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
