import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Link,
  Thead,
  Th,
  Text,
  Stack,
  Grid,
  Box,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';
import { useUserIsAdmin } from '../../hooks/administrators';
import { Record } from '../Tournament/Results/ResultsList/Record';
import { parseUsername } from '../../lib/strings';
import { RecordIcon } from '../Tournament/Results/ResultsList/RecordIcon';
import { useFinalResults } from '../../hooks/finalResults';
import { useTournaments } from '../../hooks/tournaments';
import { Standing } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import {
  reallyShortenTournamentName,
  shortenTournamentName,
} from '../../lib/tournament';
import { formatTournamentDate } from '../TournamentList/helpers';
import { TournamentCard } from '../TournamentList/TournamentCard';
import { FullPageLoader } from '../common/FullPageLoader';
import { SorryText } from '../common/SorryText';
import { CurrentTournamentResults } from '../Profile/CurrentTournamentResults/CurrentTournamentResults';
import { TournamentInfo } from '../TournamentList/TournamentInfo';

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile | null | undefined;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user?.name);
  const { data: tournamentPerformance, isLoading } = useFinalResults({
    playerName: user?.name,
    additionalNames: user?.additional_names,
    shouldExpandTournament: true
  });
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
      {/* {!userMatchesLoggedInUser &&
          (!tournamentPerformance || tournamentPerformance.length === 0) && (
            <Stack>
              <Text>{`No tournaments for ${user?.name} were found. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
            </Stack>
          )} */}
      {user?.name && (
        <CurrentTournamentResults
          user={user}
          isLoggedInUser={userMatchesLoggedInUser}
        />
      )}
      {tournamentPerformance?.map((performance: Standing, idx) => {
        if (!performance.tournamentId) return null;

        if (!performance.tournament) return null;

        return (
          <Stack key={`${performance.tournamentId}-${performance.name}`}>
            <TournamentInfo tournament={performance.tournament} />
            <PlayerCard
              player={performance}
              tournament={performance.tournament}
              shouldHideDecks={false}
              canEditDecks={userMatchesLoggedInUser || userIsAdmin}
              isPlayerMeOrMyOpponent={false}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};
