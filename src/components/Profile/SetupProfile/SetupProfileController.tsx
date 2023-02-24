import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFinalResults } from '../../../hooks/finalResults/useFinalResults';
import { useUserSentAccountRequest } from '../../../hooks/user';
import { AccountMadeSuccessfully } from './AccountMadeSuccessfully';
import { RecommendedSuggestedUser } from './RecommendSuggestedUser';
import { RequestToComplete } from './RequestToComplete';

export const SetupProfileController = () => {
  const session = useSession();
  const { data: fetchedTournamentsForUser, isLoading } = useFinalResults({
    playerName: session.data?.user?.name,
  });
  const suggestedUser =
    fetchedTournamentsForUser && fetchedTournamentsForUser.length > 0;
  const { data: userSentRequest } = useUserSentAccountRequest(
    session.data?.user?.email
  );
  const [screenState, setScreenState] =
    useState<
      | null
      | 'recommended-suggested-user'
      | 'not-found'
      | 'request-to-complete'
      | 'account-made-successfully'
    >(null);

  useEffect(() => {
    if (suggestedUser) {
      setScreenState('recommended-suggested-user');
    } else {
      setScreenState('request-to-complete');
    }
  }, [suggestedUser, userSentRequest]);

  if (isLoading) return null;
  if (screenState === 'recommended-suggested-user')
    return (
      <RecommendedSuggestedUser
        session={session.data as Session}
        didNotAttendCallback={() => setScreenState('request-to-complete')}
        accountMadeSuccessfullyCallback={() =>
          setScreenState('account-made-successfully')
        }
      />
    );
  else if (screenState === 'request-to-complete')
    return <RequestToComplete session={session.data as Session} />;
  else if (screenState === 'account-made-successfully')
    return <AccountMadeSuccessfully />;

  return null;
};
