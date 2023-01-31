import { Heading, Stack, Text } from '@chakra-ui/react';
import { differenceInDays, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Tournament, TournamentStatus } from '../../../types/tournament';
import { TournamentOrSet, useTournamentRender } from '../../hooks/sets';
import { TournamentCard } from './TournamentCard';

export const TournamentList = ({
  tournaments,
  mostRecent,
}: {
  tournaments: Tournament[];
  mostRecent?: boolean;
}) => {
  const items = useTournamentRender(tournaments);
  const getParsedItems = useCallback(() => {
    if (mostRecent) {
      const finishedTournaments = items.filter(
        tournament => tournament.data.tournamentStatus === 'finished'
      );
      const upcomingTournaments = items.filter(tournament => {
        return (
          tournament.data.tournamentStatus === 'not-started' &&
          differenceInDays(parseISO(tournament.data.date?.start), new Date()) <=
            7
        );
      });

      return [
        ...items.filter(
          tournament => tournament.data.tournamentStatus === 'running'
        ),
        ...upcomingTournaments,
        ...finishedTournaments.slice(0, 2),
      ];
    }
    return items;
  }, [items, mostRecent]);

  return (
    <Stack>
      {getParsedItems()?.map((item: Record<string, any>, idx) => {
        if (item.type === 'tournament')
          return <TournamentCard tournament={item.data} key={idx} />;
        return (
          <Text
            key={idx}
            fontSize='sm'
            color='gray.600'
            padding='1rem 1.5rem'
            as={'b'}
            letterSpacing='0.05rem'
          >
            🎉 {item.data?.name} ({item.data?.ptcgoCode}) becomes legal
          </Text>
        );
      })}
    </Stack>
  );
};
