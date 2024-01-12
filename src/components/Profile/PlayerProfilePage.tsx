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
import { ComponentLoader } from '../common/ComponentLoader';
import { FullPageLoader } from '../common/FullPageLoader';
import { PlayerPerformanceList } from '../DataDisplay/PlayerPerformanceList';
import { FollowButton } from '../Social/FollowButton';
import { ShareProfile } from '../Social/ShareProfile';
import { Username } from './Username';
import { UsernameEditable } from './UsernameEditable';
import { usePlayerStandings } from '../../hooks/newStandings';
import { Flex } from '@tremor/react';

export interface PlayerProfilePageProps {
  profile: CombinedPlayerProfile;
  userIsLoggedInUser: boolean;
}

export const PlayerProfilePage = (props: PlayerProfilePageProps) => {
  const sessionContext = useSessionContext();

  const { isLoading: finalResultsAreLoading } = usePlayerStandings(props.profile)

  if (finalResultsAreLoading) return <FullPageLoader />;

  return (
    <div>
      <Flex className='mt-2 flex-col'>
        <Heading>{props.profile.preferred_name ?? props.profile.name}</Heading>
        <HStack>
          {props.userIsLoggedInUser && (
            <UsernameEditable
              profile={props.profile}
              userIsLoggedInUser={props.userIsLoggedInUser}
            />
          )}
          {sessionContext.isLoading && <ComponentLoader />}
          {!sessionContext.isLoading && (
            <>
              {!props.userIsLoggedInUser && props.profile.name && (
                <FollowButton playerName={props.profile.name} />
              )}
            </>
          )}
        </HStack>
      </Flex>
      <PlayerPerformanceList user={props.profile} />
    </div>
  );
};
