import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SetupProfileController } from '../src/components/Profile/SetupProfile/SetupProfileController';
import { fetchUserProfile, useSessionUserProfile } from '../src/hooks/user';

export default function SetupPage() {
  const router = useRouter();
  const { data: user, isLoading } = useSessionUserProfile();

  useEffect(() => {
    if (user) {
      router.push(`/profile`);
    }
    if (!isLoading && user) {
      router.push('/');
    }
  }, [router, user, isLoading]);

  return <SetupProfileController userProfile={user} />;
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
