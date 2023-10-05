import {
  Text,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import { useUserIsAdmin } from '../../hooks/administrators';
import { Standing } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import { FullPageLoader } from '../common/FullPageLoader';
import { TournamentInfo } from '../TournamentList/TournamentInfo';
import { usePlayerStandings } from '../../hooks/newStandings';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile | null | undefined;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user?.name);
  const { data: tournamentPerformance, isLoading } = usePlayerStandings(user);
  const { data: userIsAdmin } = useUserIsAdmin();

  if (isLoading) return <FullPageLoader />;

  return (
    <Stack spacing={8} py={6} px={2}>
      {userMatchesLoggedInUser &&
        (!tournamentPerformance || tournamentPerformance.length === 0) && (
          <Stack>
            <Text>{`We couldn't find any tournaments you've attended. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
            <Text>{`If you've registered for an upcoming tournament, that tournament will show up once it has started.`}</Text>
          </Stack>
        )}
      {tournamentPerformance?.map((performance: Standing) => {
        if (!performance.tournament_id) return null;

        if (!performance.tournament) return null;

        if (performance.tournament.tournamentStatus === 'running') {
          return (
            <PlayerTournamentView
              tournament={performance.tournament}
              playerName={performance.name}
            />
          )
        }

        return (
          <Stack key={`${performance.tournament_id}-${performance.name}`}>
            <TournamentInfo tournament={performance.tournament} />
            <PlayerCard
              player={performance}
              tournament={performance.tournament}
              canEditDecks={userMatchesLoggedInUser || userIsAdmin}
              isPlayerMeOrMyOpponent={false}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};
