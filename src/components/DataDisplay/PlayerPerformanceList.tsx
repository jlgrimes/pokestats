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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { usePlayerPerformance } from '../../hooks/tournamentResults';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';
import { useUserIsAdmin } from '../../hooks/administrators';
import { Record } from '../Tournament/Results/ResultsList/Record';
import { parseUsername } from '../../lib/strings';
import { RecordIcon } from '../Tournament/Results/ResultsList/RecordIcon';
import { useFinalResults } from '../../hooks/finalResults';
import { useTournaments } from '../../hooks/tournaments';
import { FinalResultsSchema } from '../../../types/final-results';
import { Standing } from '../../../types/tournament';

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user.name);
  const { data: tournamentPerformance } = useFinalResults({
    playerName: user.name,
  });
  const { data: tournaments } = useTournaments();
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
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
          {tournamentPerformance?.map(
            (performance: FinalResultsSchema, idx) => {
              const tournament = tournaments?.find(
                ({ id }) => id === performance.tournament_id
              );
              const standing: Standing = {
                name: performance.name,
                placing: performance.placing,
                record: performance.record,
                resistances: performance.resistances,
                rounds: performance.rounds,
                deck: performance.
              }

              return (
                tournament && (
                  <Tr height='41px' key={idx}>
                    <Td padding={2}>
                      <Link
                        as={NextLink}
                        color='blue.600'
                        href={`/tournaments/${performance.tournament_id}/standings`}
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
                          standing={standing}
                          href={
                            userMatchesLoggedInUser
                              ? `/tournaments/${
                                  performance.tournament_id
                                }/${parseUsername(user.email)}`
                              : undefined
                          }
                        />
                        <RecordIcon
                          standing={standing}
                          tournamentFinished={
                            tournament?.tournamentStatus === 'finished'
                          }
                        />
                      </Stack>
                    </Td>
                    <Td padding={0} paddingLeft={2} width='80px'>
                      <DeckInfoDisplay
                        tournament={tournament}
                        player={standing}
                        enableEdits={userMatchesLoggedInUser || userIsAdmin}
                      />
                    </Td>
                  </Tr>
                )
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
