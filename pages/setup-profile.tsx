import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SetupProfileController } from '../src/components/Profile/SetupProfile/SetupProfileController';
import { fetchUserProfile, useSessionUserProfile } from '../src/hooks/user';

export default function SetupPage() {
  const router = useRouter();
  const session = useSession();
  const { data: user, isLoading, refetch } = useSessionUserProfile();

  useEffect(() => {
    if (user) {
      location.assign('/profile');
    }
  }, [router, user, isLoading]);

  return <SetupProfileController userProfile={session.data?.user} />;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const queryClient = new QueryClient();
  if (session) {
    await queryClient.prefetchQuery([`session-user-profile`], () =>
      fetchUserProfile(session)
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
