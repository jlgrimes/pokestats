import { Heading, Stack, Text } from '@chakra-ui/react';
import { differenceInDays, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Tournament, TournamentStatus } from '../../../types/tournament';
import { TournamentOrSet, useTournamentRender } from '../../hooks/sets';
import { tournamentHasArrivedButNotLive } from './helpers';
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
      const almostStartedTournamentFilter = (tournament: TournamentOrSet) =>
        tournament.data.date &&
        tournamentHasArrivedButNotLive(
          tournament.data as unknown as Tournament
        );

      const upcomingTournaments = items.filter(tournament => {
        return (
          tournament.data.tournamentStatus === 'not-started' &&
          differenceInDays(parseISO(tournament.data.date?.start), new Date()) <=
            7 &&
          !almostStartedTournamentFilter(tournament)
        );
      });

      const liveTournaments = items.filter(
        tournament => tournament.data.tournamentStatus === 'running'
      );
      const almostStartedTournaments = items.filter(tournament =>
        almostStartedTournamentFilter(tournament)
      );

      return {
        highlightedTournamentsLength:
          liveTournaments.length + almostStartedTournaments.length,
        items: [
          ...liveTournaments,
          ...almostStartedTournaments,
          ...finishedTournaments.slice(0, 2),
          ...upcomingTournaments,
        ],
      };
    }
    return {
      highlightedTournamentsLength: 0,
      items,
    };
  }, [items, mostRecent]);
  const parsedItems = getParsedItems();

  return (
    <Stack>
      {parsedItems?.items.map((item: Record<string, any>, idx) => {
        if (item.type === 'tournament')
          return (
            <TournamentCard
              tournament={item.data}
              key={idx}
              live={idx < parsedItems.highlightedTournamentsLength}
            />
          );
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
