import { Box, Grid, Stack } from '@chakra-ui/react';
import { PlayerRound, Standing, Tournament } from '../../../types/tournament';
import { StatsHeading } from '../common/StatsHeading';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';

interface RoundsListProps {
  rounds: PlayerRound[];
  tournament: Tournament;
  shouldHideDecks: boolean;
  shouldDisableOpponentModal?: boolean;
}

export const RoundsList = (props: RoundsListProps) => {
  const rounds = props.rounds.reverse();

  return (
    <Stack spacing={rounds && rounds.length > 9 ? 1 : 2}>
      {rounds?.reverse()?.map(
        (round, idx) =>
          round?.opponent && (
            <Grid gridTemplateColumns='30px auto' key={idx} alignItems='center'>
              <Box display='flex' justifyContent={'center'}>
                <StatsHeading
                  headingProps={{ color: 'gray.600', fontSize: 'lg' }}
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
                  canEditDecks={!round.opponent.deck?.name}
                  size={rounds.length < 10 ? 'lg' : 'sm'}
                  shouldHideOpponent
                  shouldDisableOpponentModal={props.shouldDisableOpponentModal}
                  result={round.result}
                />
              </Box>
            </Grid>
          )
      )}
    </Stack>
  );
};
