import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SetupProfileController } from '../src/components/Profile/SetupProfile/SetupProfileController';
import { fetchUserProfile, useSessionUserProfile } from '../src/hooks/user';
import { parseUsername } from '../src/lib/strings';

export default function SetupPage() {
  const session = useSession();
  const router = useRouter();
  const { data: user } = useSessionUserProfile();

  useEffect(() => {
    if (user) {
      router.push(`/player/${parseUsername(user.email)}`);
    }
  }, [router, user]);

  if (!session.data?.user) {
    return null;
  }

  return <SetupProfileController />;
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
