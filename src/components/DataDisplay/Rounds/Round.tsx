import { Box, Grid, useColorMode } from '@chakra-ui/react';
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
    <Grid gridTemplateColumns='25px auto' alignItems='center'>
      <Box display='flex' justifyContent={'center'}>
        <StatsHeading
          headingProps={{
            color: colorMode === 'dark' ? 'gray.400' : 'gray.600',
            fontSize: 'lg',
          }}
        >
          {props.roundNumber}
        </StatsHeading>
      </Box>
      <Box flexGrow={1}>
        <PlayerCard
          player={props.opponent}
          tournament={props.tournament}
          shouldHideDecks={props.shouldHideDecks}
          shouldHideStanding
          canEditDecks={
            props.userIsAdmin ||
            (props.canEditDecks && !props.opponent?.deck?.name)
          }
          size={(props.player.rounds?.length ?? 0) < 10 ? 'md' : 'sm'}
          shouldHideOpponent
          shouldDisableOpponentModal={props.shouldDisableOpponentModal}
          result={props.round.result}
          shouldMoveResultLast
          isPlayerMeOrMyOpponent={isMyOpponent}
        />
      </Box>
    </Grid>
  );
};
