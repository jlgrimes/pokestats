import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Link,
  Thead,
  Th,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { usePlayerPerformance } from '../../hooks/tournamentResults';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import SpriteDisplay from '../common/SpriteDisplay';
import DeckInput from '../Deck/DeckInput/DeckInput';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { ListViewerOpenButton } from '../Deck/ListViewer/ListViewerOpenButton';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';

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

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th padding={0} paddingLeft={2}>
              Tournament
            </Th>
            <Th padding={0}>Seed</Th>
            <Th padding={0} paddingLeft={2}>Record</Th>
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
                    {userMatchesLoggedInUser ? (
                      <Link
                        as={NextLink}
                        color='blue.500'
                        href={`/tournaments/${tournament.id}/my-results`}
                      >
                        {tournament.name}
                      </Link>
                    ) : (
                      tournament.name
                    )}
                  </Td>
                  <Td padding={0}>{performance.placing}</Td>
                  <Td padding={0} paddingLeft={2}>{formatRecord(performance.record)}</Td>
                  <Td padding={0} paddingLeft={2}>
                    <DeckInfoDisplay
                      tournament={tournament}
                      player={performance}
                      enableEdits={userMatchesLoggedInUser}
                      quickEdits={false}
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
