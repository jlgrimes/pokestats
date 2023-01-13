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

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user.name);
  const tournamentPerformance = usePlayerPerformance(
    user?.name,
    user?.tournamentHistory
  );
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
          {tournamentPerformance.map(
            ({ performance, tournament }, idx) =>
              tournament && (
                <Tr height='41px' key={idx}>
                  <Td padding={2}>
                    <Link
                      as={NextLink}
                      color='blue.600'
                      href={`/tournaments/${tournament.id}/standings`}
                    >
                      <Text
                        fontSize='sm'
                        whiteSpace={'pre-wrap'}
                        overflowWrap={'break-word'}
                      >
                        {tournament.name}
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
                            ? `/tournaments/${tournament.id}/${parseUsername(
                                user.email
                              )}`
                            : undefined
                        }
                      />
                      <RecordIcon
                        standing={performance}
                        tournamentFinished={
                          tournament.tournamentStatus === 'finished'
                        }
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
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
