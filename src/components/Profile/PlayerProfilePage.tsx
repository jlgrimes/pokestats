import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useSession } from 'next-auth/react';
import { CombinedPlayerProfile } from '../../../types/player';
import { useFinalResults } from '../../hooks/finalResults';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import { ComponentLoader } from '../common/ComponentLoader';
import { FullPageLoader } from '../common/FullPageLoader';
import { PlayerPerformanceList } from '../DataDisplay/PlayerPerformanceList';
import { FollowButton } from '../Social/FollowButton';
import { ShareProfile } from '../Social/ShareProfile';
import { Username } from './Username';
import { UsernameEditable } from './UsernameEditable';

export interface PlayerProfilePageProps {
  profile: CombinedPlayerProfile;
  userIsLoggedInUser: boolean;
}

export const PlayerProfilePage = (props: PlayerProfilePageProps) => {
  const sessionContext = useSessionContext();

  const { isLoading: finalResultsAreLoading } = useFinalResults({
    playerName: props.profile.name,
    additionalNames: props.profile.additional_names,
  });

  if (finalResultsAreLoading) return <FullPageLoader />;

  return (
    <Stack>
      <Stack spacing={0} alignItems='center'>
        <Heading>{props.profile.preferred_name ?? props.profile.name}</Heading>
        <HStack>
          {props.userIsLoggedInUser ? (
            <UsernameEditable
              profile={props.profile}
              userIsLoggedInUser={props.userIsLoggedInUser}
            />
          ) : (
            props.profile.username && (
              <Username>{props.profile.username}</Username>
            )
          )}
          {sessionContext.isLoading && <ComponentLoader />}
          {!sessionContext.isLoading && (
            <>
              {props.userIsLoggedInUser && props.profile.username && (
                <ShareProfile username={props.profile.username} />
              )}
              {!props.userIsLoggedInUser && props.profile.name && (
                <FollowButton playerName={props.profile.name} />
              )}
            </>
          )}
        </HStack>
      </Stack>
      <PlayerPerformanceList user={props.profile} />
    </Stack>
  );
};
