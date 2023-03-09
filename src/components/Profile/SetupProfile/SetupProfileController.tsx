import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFinalResults } from '../../../hooks/finalResults';
import {
  SessionUserProfile,
  useUserSentAccountRequest,
} from '../../../hooks/user';
import { AccountMadeSuccessfully } from './AccountMadeSuccessfully';
import { RecommendedSuggestedUser } from './RecommendSuggestedUser';
import { RequestToComplete } from './RequestToComplete';

export interface SetupProfileControllerProps {
  userProfile?: SessionUserProfile | null;
}

export const SetupProfileController = (props: SetupProfileControllerProps) => {
  const { userProfile } = props;

  const { data: fetchedTournamentsForUser, isLoading } = useFinalResults({
    playerName: userProfile?.name,
  });
  const suggestedUser =
    fetchedTournamentsForUser && fetchedTournamentsForUser.length > 0;
  const { data: userSentRequest } = useUserSentAccountRequest(
    userProfile?.email
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

  if (isLoading || !userProfile) return null;
  if (screenState === 'recommended-suggested-user')
    return (
      <RecommendedSuggestedUser
        userProfile={userProfile}
        didNotAttendCallback={() => setScreenState('request-to-complete')}
        accountMadeSuccessfullyCallback={() =>
          setScreenState('account-made-successfully')
        }
      />
    );
  else if (screenState === 'request-to-complete')
    return <RequestToComplete userProfile={userProfile} />;
  else if (screenState === 'account-made-successfully')
    return <AccountMadeSuccessfully />;

  return null;
};
