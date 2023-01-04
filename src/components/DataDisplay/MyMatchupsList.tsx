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
import { Tournament } from '../../../types/tournament';

export const MyMatchupsList = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const player = useLoggedInPlayerLiveResults(tournament.id, {
    load: { opponentRoundData: true },
  });

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th padding={0} paddingLeft={2}>Round</Th>
            <Th padding={0} paddingLeft={2}>
              Name
            </Th>
            <Th padding={0} paddingLeft={2}>
              Record
            </Th>
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
                    paddingLeft={2}
                    backgroundColor={getResultBackgroundColor(round.result)}
                    textAlign='center'
                  >
                    {(player.rounds?.length ?? 0) - idx}
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

                  <Td padding={0} paddingLeft={2}>
                    {formatRecord(round.opponent.record)}
                  </Td>
                  <Td padding={0} paddingLeft={2}>
                    <DeckInfoDisplay
                      tournament={tournament}
                      player={round.opponent}
                      // We don't want player to edit something they already edited
                      enableEdits={!round.opponent.deck.name}
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
