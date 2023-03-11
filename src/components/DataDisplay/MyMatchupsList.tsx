import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Thead,
  Th,
  Stack,
  HStack,
  Box,
  Heading,
  Grid,
} from '@chakra-ui/react';
import { usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo, useMemo } from 'react';
import { MyMatchupRow } from './MyMatchupRow';
import { StandingsRow } from './Standings/StandingsRow';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import { StatsHeading } from '../common/StatsHeading';
import { CommonCard } from '../common/CommonCard';
import { getResultBackgroundColor } from './helpers';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
  }: {
    tournament: Tournament;
    user: Record<string, any> | undefined;
  }) => {
    const { player, shouldHideDecks } = usePlayerLiveResults(
      tournament.id,
      user?.name,
      {
        load: { opponentRoundData: true },
      }
    );

    const rounds = useMemo(() => player?.rounds?.reverse(), [player?.rounds]);

    return (
      <Stack spacing={rounds && rounds.length > 9 ? 1 : 2}>
        {rounds?.map(
          (round, idx) =>
            round?.opponent && (
              <Grid
                gridTemplateColumns='30px auto'
                key={idx}
                alignItems='center'
              >
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
                    tournament={tournament}
                    shouldHideDecks={shouldHideDecks}
                    shouldHideStanding
                    canEditDecks={!round.opponent.deck?.name}
                    backgroundColor={getResultBackgroundColor(round.result)}
                    size={rounds.length < 10 ? 'lg' : 'sm'}
                  />
                </Box>
              </Grid>
            )
        )}
      </Stack>
    );
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
