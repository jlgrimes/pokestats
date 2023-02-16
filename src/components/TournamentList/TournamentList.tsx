import { Heading, Stack, Text } from '@chakra-ui/react';
import { differenceInDays, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Tournament, TournamentStatus } from '../../../types/tournament';
import { TournamentOrSet, useTournamentRender } from '../../hooks/sets';
import {
  getMostRecentTournaments,
  tournamentHasArrivedButNotLive,
} from './helpers';
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
      return getMostRecentTournaments(items);
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
