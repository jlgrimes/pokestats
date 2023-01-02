import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useSuggestedUserProfile } from '../../../hooks/user';
import { RecommendedSuggestedUser } from './RecommendSuggestedUser';
import { SuggestedNotFound } from './SuggestedNotFound';

export const SetupProfileController = () => {
  const session = useSession();
  const { data: suggestedUser, isLoading } = useSuggestedUserProfile();

  if (isLoading) return null;
  // TODO: replace with redirect back to something
  if (session === null) return null;
  if (suggestedUser)
    return <RecommendedSuggestedUser session={session.data as Session} />;
  else return <SuggestedNotFound session={session.data as Session} />

  return null;
};
