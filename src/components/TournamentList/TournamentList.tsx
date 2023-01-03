import { Stack } from '@chakra-ui/react';
import { TournamentCard } from './TournamentCard';

export const TournamentList = ({
  tournaments,
}: {
  tournaments: { id: string; name: string }[];
}) => {
  return (
    <Stack>
      {tournaments.reverse()?.map((tournament, idx) => (
        <TournamentCard tournament={tournament} key={idx} />
      ))}
    </Stack>
  );
};
