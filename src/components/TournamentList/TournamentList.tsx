import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { TournamentCard } from './TournamentCard';

export const TournamentList = ({
  tournaments,
}: {
  tournaments: Tournament[];
}) => {
  return (
    <Stack>
      {tournaments.reverse()?.map((tournament, idx) => (
        <TournamentCard tournament={tournament} key={idx} />
      ))}
    </Stack>
  );
};
