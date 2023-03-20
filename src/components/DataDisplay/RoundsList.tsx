import { Box, Flex, Grid, HStack, Stack, useColorMode } from '@chakra-ui/react';
import { PlayerRound, Standing, Tournament } from '../../../types/tournament';
import { StatsHeading } from '../common/StatsHeading';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import { getResultBackgroundColor } from './helpers';

interface RoundsListProps {
  rounds: PlayerRound[];
  tournament: Tournament;
  shouldHideDecks: boolean;
  shouldDisableOpponentModal?: boolean;
  canEditDecks?: boolean;
  userIsAdmin?: boolean;
}

export const RoundsList = (props: RoundsListProps) => {
  const { colorMode } = useColorMode();

  const rounds = props.rounds.slice().reverse();

  return (
    <Stack spacing={rounds && rounds.length > 9 ? 1 : 2}>
      {rounds.map(
        (round, idx) =>
          round?.opponent && (
            <Grid gridTemplateColumns='25px auto' key={idx} alignItems='center'>
              <Box display='flex' justifyContent={'center'}>
                <StatsHeading
                  headingProps={{
                    color: colorMode === 'dark' ? 'gray.400' : 'gray.600',
                    fontSize: 'lg',
                  }}
                >
                  {(rounds?.length ?? 0) - idx}
                </StatsHeading>
              </Box>
              <Box flexGrow={1}>
                <PlayerCard
                  player={round.opponent}
                  tournament={props.tournament}
                  shouldHideDecks={props.shouldHideDecks}
                  shouldHideStanding
                  canEditDecks={
                    props.userIsAdmin ||
                    (props.canEditDecks && !round.opponent.deck?.name)
                  }
                  size={rounds.length < 10 ? 'md' : 'sm'}
                  shouldHideOpponent
                  shouldDisableOpponentModal={props.shouldDisableOpponentModal}
                  result={round.result}
                  shouldMoveResultLast
                />
              </Box>
            </Grid>
          )
      )}
    </Stack>
  );
};
