import { Box, Grid, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { Tournament } from '../../../types/tournament';
import { useChampions } from '../../hooks/finalResults';
import { useTournamentRender } from '../../hooks/sets';
import { getTournaments } from './helpers';
import { TournamentCard } from './TournamentCard';

export const TournamentList = ({
  tournaments,
  mostRecent,
}: {
  tournaments: Tournament[];
  mostRecent?: boolean;
}) => {
  const { data: champions } = useChampions();
  const items = useTournamentRender(tournaments, mostRecent);
  const parsedItems = getTournaments(items, mostRecent);

  return (
    <Grid gap={2} gridTemplateColumns='1fr 1fr'>
      {parsedItems?.items.map((item: Record<string, any>, idx) => {
        if (item.type === 'tournament') {
          const tournamentId = (item.data as Tournament).id;
          const isTournamentUpcoming =
            (item.data as Tournament).tournamentStatus === 'not-started';
          const isAboutToStart =
            idx < parsedItems.highlightedTournamentsLength &&
            isTournamentUpcoming;

          return (
            <Box
              key={idx}
              gridColumn={
                // isTournamentUpcoming && !isAboutToStart ? 'auto' : '1/-1'
                '1/-1'
              }
            >
              <TournamentCard
                tournament={item.data}
                champion={champions ? champions[tournamentId] : undefined}
              />
            </Box>
          );
        }
        return (
          <Text
            gridColumn={'1/-1'}
            key={idx}
            fontSize='sm'
            color='gray.600'
            padding='1rem 1.5rem'
            as={'b'}
            letterSpacing='0.05rem'
          >
            🎉 {item.data?.name} ({item.data?.ptcgoCode}) became legal
          </Text>
        );
      })}
    </Grid>
  );
};
