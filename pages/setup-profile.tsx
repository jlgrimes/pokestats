import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SetupProfileController } from '../src/components/Profile/SetupProfile/SetupProfileController';
import { fetchUserProfile, useSessionPlayerProfile } from '../src/hooks/user';

export default function SetupPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useSessionPlayerProfile();
  const user = useUser();

  useEffect(() => {
    if (profile) {
      location.assign('/profile');
    }
  }, [router, profile, isLoading]);

  return <SetupProfileController userProfile={user} />;
}

export async function getServerSideProps(context: any) {
  const supabaseClient = createServerSupabaseClient(context);
  // Check if we have a session
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  const queryClient = new QueryClient();

  if (session) {
    await queryClient.prefetchQuery([`session-user-profile`], () =>
      fetchUserProfile(session.user)
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
