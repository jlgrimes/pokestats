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

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile | null | undefined;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user?.name);
  const { data: tournamentPerformance, isLoading } = useFinalResults({
    playerName: user?.name,
  });
  const { data: tournaments } = useTournaments();
  const { data: userIsAdmin } = useUserIsAdmin();

  if (isLoading) return <FullPageLoader />;

  return (
    <CommonCard header='Tournaments' ghost>
      <Stack spacing={4}>
        {userMatchesLoggedInUser &&
          (!tournamentPerformance || tournamentPerformance.length === 0) && (
            <Stack>
              <Text>{`We couldn't find any tournaments you've attended. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
              <Text>{`If you've registered for an upcoming tournament, that tournament will show up once it has started.`}</Text>
            </Stack>
          )}
        {!userMatchesLoggedInUser &&
          (!tournamentPerformance || tournamentPerformance.length === 0) && (
            <Stack>
              <Text>{`No tournaments for ${user?.name} were found. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
            </Stack>
          )}
        {tournamentPerformance?.map((performance: Standing, idx) => {
          if (!performance.tournamentId) return null;

          const tournament = tournaments?.find(
            ({ id }) => id === performance.tournamentId
          );

          if (!tournament) return null;

          return (
            <Stack
              gridTemplateColumns={'1fr 1fr'}
              key={`${performance.tournamentId}-${performance.name}`}
            >
              <TournamentCard tournament={tournament} />
              <Box>
                <PlayerCard
                  player={performance}
                  tournament={tournament}
                  shouldHideDecks={false}
                  canEditDecks={userMatchesLoggedInUser || userIsAdmin}
                />
              </Box>
            </Stack>
            // <CommonCard
            //   header={reallyShortenTournamentName(tournament)}
            //   subheader={formatTournamentDate(tournament)}
            //   ghost
            //   key={`${performance.tournamentId}-${performance.name}`}
            // >
            // </CommonCard>
          );
        })}
      </Stack>
    </CommonCard>
  );

  return (
    <CommonCard header='my tournaments' ghost>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th padding={0} paddingLeft={2}>
                Tournament
              </Th>
              <Th padding={0}>Seed</Th>
              <Th padding={0} paddingLeft={2}>
                Record
              </Th>
              <Th padding={0} paddingLeft={2}>
                Deck
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tournamentPerformance?.map((performance: Standing, idx) => {
              if (!performance.tournamentId) return null;

              const tournament = tournaments?.find(
                ({ id }) => id === performance.tournamentId
              );

              return (
                tournament && (
                  <Tr height='41px' key={idx}>
                    <Td padding={2}>
                      <Link
                        as={NextLink}
                        color='blue.600'
                        href={`/tournaments/${performance.tournamentId}`}
                      >
                        <Text
                          fontSize='sm'
                          whiteSpace={'pre-wrap'}
                          overflowWrap={'break-word'}
                        >
                          {tournament?.name}
                        </Text>
                      </Link>
                    </Td>
                    <Td padding={0}>{performance.placing}</Td>
                    <Td padding={0} paddingLeft={2}>
                      <Stack direction={'row'} spacing={1} alignItems='center'>
                        <Record
                          standing={performance}
                          href={
                            userMatchesLoggedInUser
                              ? `/tournaments/${
                                  performance.tournamentId
                                }/${parseUsername(user?.email ?? '')}`
                              : undefined
                          }
                        />
                        <RecordIcon
                          standing={performance}
                          tournament={tournament}
                        />
                      </Stack>
                    </Td>
                    <Td padding={0} paddingLeft={2} width='80px'>
                      <DeckInfoDisplay
                        tournament={tournament}
                        player={performance}
                        enableEdits={userMatchesLoggedInUser || userIsAdmin}
                      />
                    </Td>
                  </Tr>
                )
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </CommonCard>
  );
};
