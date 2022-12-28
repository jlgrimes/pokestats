import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useLoggedInPlayerLiveResults } from '../../hooks/tournamentResults';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from './helpers';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';

export const MyMatchupsList = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const player = useLoggedInPlayerLiveResults(tournament.id, {
    load: { opponentRoundData: true },
  });

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th padding={0}>Round</Th>
            <Th padding={0} paddingLeft={2}>
              Name
            </Th>
            <Th padding={0}>Record</Th>
            <Th padding={0} paddingLeft={2}>
              Deck
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {player?.rounds?.reverse().map(
            (round, idx) =>
              round?.opponent && (
                <Tr height='41px' key={idx}>
                  <Td
                    padding={0}
                    backgroundColor={getResultBackgroundColor(round.result)}
                    textAlign='center'
                  >
                    {(player.rounds?.length ?? 0)- idx}
                  </Td>
                  <Td
                    maxWidth={'12rem'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    padding={0}
                    paddingLeft={2}
                  >
                    <Player
                      name={round.opponent.name}
                      profile={round.opponent.profile}
                      isEditable={false}
                    />
                  </Td>

                  <Td padding={0}>{formatRecord(round.opponent.record)}</Td>
                  <Td padding={0}>
                    <DeckInfoDisplay
                      tournament={tournament}
                      player={round.opponent}
                      enableEdits={true}
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
