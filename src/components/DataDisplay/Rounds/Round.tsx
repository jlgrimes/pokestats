import { Box, Grid, useColorMode } from '@chakra-ui/react';
import { Bold, TableCell } from '@tremor/react';
import { PlayerRound, Standing } from '../../../../types/tournament';
import { usePlayerIsMeOrMyOpponent } from '../../../hooks/tournamentResults';
import { StatsHeading } from '../../common/StatsHeading';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { RoundsListProps } from './RoundsList';

interface RoundProps extends RoundsListProps {
  round: PlayerRound;
  roundNumber: number;
  opponent: Standing;
}

export const Round = (props: RoundProps) => {
  const { colorMode } = useColorMode();
  const isMyOpponent = usePlayerIsMeOrMyOpponent(props.opponent);

  return (
    <PlayerCard
      player={props.opponent}
      tournament={props.tournament}
      shouldHideDecks={props.shouldHideDecks}
      shouldHideStanding
      canEditDecks={
        props.userIsAdmin ||
        (props.canEditDecks && !props.opponent?.deck_archetype?.name)
      }
      size={(props.player.rounds?.length ?? 0) < 10 ? 'md' : 'sm'}
      shouldHideOpponent
      shouldDisableOpponentModal={props.shouldDisableOpponentModal}
      result={props.round.result}
      shouldMoveResultLast
      isPlayerMeOrMyOpponent={isMyOpponent}
      roundNumber={props.roundNumber}
    />
  );
};
