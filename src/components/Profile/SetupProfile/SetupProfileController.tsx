import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSuggestedUserProfile } from '../../../hooks/user';
import { RecommendedSuggestedUser } from './RecommendSuggestedUser';
import { RequestToComplete } from './RequestToComplete';

export const SetupProfileController = () => {
  const session = useSession();
  const { data: suggestedUser, isLoading } = useSuggestedUserProfile();
  const [screenState, setScreenState] =
    useState<
      null | 'recommended-suggested-user' | 'not-found' | 'request-to-complete'
    >(null);

  useEffect(() => {
    if (suggestedUser) {
      setScreenState('recommended-suggested-user');
    }
  }, [suggestedUser]);

  if (isLoading) return null;
  // TODO: replace with redirect back to something
  if (session === null) return null;
  console.log(screenState);
  if (screenState === 'recommended-suggested-user')
    return (
      <RecommendedSuggestedUser
        session={session.data as Session}
        didNotAttendCallback={() => setScreenState('request-to-complete')}
      />
    );
  else if (screenState === 'request-to-complete')
    return <RequestToComplete session={session.data as Session} />;

  return null;
};
