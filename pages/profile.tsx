import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PlayerProfilePage } from '../src/components/Profile/PlayerProfilePage';
import { fetchArchetypes } from '../src/hooks/deckArchetypes';
import { fetchTournaments } from '../src/hooks/tournaments';
import { useSessionPlayerProfile } from '../src/hooks/user';
import { Tournament } from '../types/tournament';

export default function ProfilePage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const router = useRouter();
  const { data: user, isLoading, isAuthenticated } = useSessionPlayerProfile();

  useEffect(() => {
    try {
      // If user is on the page with their profile, and there is not a profile stored
      if (isAuthenticated && !isLoading && !user) {
        router.push('/setup-profile');
      }
    } catch (err) {
      console.log(err);
    }
  }, [isAuthenticated, router, user, isLoading]);

  return user && <PlayerProfilePage profile={user} userIsLoggedInUser />;
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
