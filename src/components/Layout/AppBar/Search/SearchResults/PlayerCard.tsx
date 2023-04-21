import NextLink from 'next/link';
import {
  Box,
  Card,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CombinedPlayerProfile } from '../../../../../../types/player';
import { FollowButton } from '../../../../Social/FollowButton';

interface PlayerResultProps {
  player: CombinedPlayerProfile;
  handleClose: () => void;
}

export const PlayerCard = (props: PlayerResultProps) => {
  if (props.player.username) {
    return (
      <LinkBox key={props.player.name}>
        <Card paddingY={2} paddingX={4}>
          <HStack justifyContent='space-between'>
            <LinkOverlay
              as={NextLink}
              href={`/player/${props.player.username}`}
              onClick={props.handleClose}
            >
              <Stack spacing={0}>
                <Text fontWeight='semibold' fontSize='md'>
                  {props.player.name}
                </Text>
                <Text fontSize='sm' fontWeight='medium' opacity='0.7'>
                  {props.player.username}
                </Text>
              </Stack>
            </LinkOverlay>
            <Box onClick={e => e.stopPropagation()}>
              <FollowButton playerName={props.player.name} />
            </Box>
          </HStack>
        </Card>
      </LinkBox>
    );
  }

  return (
    <Card variant='filled' paddingY={2} paddingX={4} key={props.player.name}>
      <HStack justifyContent='space-between'>
        <Text fontWeight='semibold' fontSize='md'>
          {props.player.name}
        </Text>
        <Box>
          <FollowButton playerName={props.player.name} />
        </Box>
      </HStack>
    </Card>
  );
};
