import { Box, Flex, Grid, HStack, Stack, useColorMode } from '@chakra-ui/react';
import {
  PlayerRound,
  Standing,
  Tournament,
} from '../../../../types/tournament';
import { usePlayerIsMeOrMyOpponent } from '../../../hooks/tournamentResults';
import { StatsHeading } from '../../common/StatsHeading';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { getResultBackgroundColor } from '../helpers';
import { Round } from './Round';

export interface RoundsListProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean;
  shouldDisableOpponentModal?: boolean;
  canEditDecks?: boolean;
  userIsAdmin?: boolean;
}

export const RoundsList = (props: RoundsListProps) => {
  const rounds = props.player.rounds?.slice().reverse();

  return (
    <Stack spacing={rounds && rounds.length > 9 ? 1 : 2}>
      {rounds?.map(
        (round, idx) =>
          round?.opponent && (
            <Round
              {...props}
              key={idx}
              round={round}
              roundNumber={(rounds?.length ?? 0) - idx}
              opponent={round.opponent}
            />
          )
      )}
    </Stack>
  );
};
