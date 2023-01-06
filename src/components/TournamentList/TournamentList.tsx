import { Heading, Stack, Text } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { TournamentOrSet, useTournamentRender } from '../../hooks/sets';
import { TournamentCard } from './TournamentCard';

export const TournamentList = ({
  tournaments,
}: {
  tournaments: Tournament[];
}) => {
  const items = useTournamentRender(tournaments);
  return (
    <Stack>
      {items.reverse()?.map((item: Record<string, any>, idx) => {
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
