import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { CombinedPlayerProfile } from '../../../types/player';
import { useFinalResults } from '../../hooks/finalResults';
import { FullPageLoader } from '../common/FullPageLoader';
import { PlayerPerformanceList } from '../DataDisplay/PlayerPerformanceList';
import { FollowButton } from '../Social/FollowButton';
import { UsernameEditable } from './UsernameEditable';

interface PlayerProfilePageProps {
  profile: CombinedPlayerProfile;
}

export const PlayerProfilePage = (props: PlayerProfilePageProps) => {
  const session = useSession();

  const { isLoading: finalResultsAreLoading } = useFinalResults({
    playerName: props.profile.name,
  });

  if (finalResultsAreLoading || session.status === 'loading')
    return <FullPageLoader />;

  return (
    <Stack>
      <Stack spacing={0} alignItems='center'>
        <Heading>{props.profile.name}</Heading>
        <HStack>
          <UsernameEditable profile={props.profile} />
          {props.profile.name && (
            <FollowButton playerName={props.profile.name} />
          )}
        </HStack>
      </Stack>
      <PlayerPerformanceList user={props.profile} />
    </Stack>
  );
};
