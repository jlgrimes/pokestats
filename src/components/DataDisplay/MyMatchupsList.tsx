import { TableContainer, Table, Tbody, Tr, Thead, Th } from '@chakra-ui/react';
import { usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo } from 'react';
import { MyMatchupRow } from './MyMatchupRow';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
  }: {
    tournament: Tournament;
    user: Record<string, any>;
  }) => {
    const { player, shouldHideDecks } = usePlayerLiveResults(
      tournament.id,
      user.name,
      {
        load: { opponentRoundData: true },
      }
    );

    return (
      <TableContainer>
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Th padding={0} paddingLeft={2}>
                Round
              </Th>
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
            {player?.rounds
              ?.reverse()
              .map(
                (round, idx) =>
                  round?.opponent && (
                    <MyMatchupRow
                      key={idx}
                      tournament={tournament}
                      roundNumber={(player.rounds?.length ?? 0) - idx}
                      round={round}
                      shouldHideDeck={!!shouldHideDecks}
                    />
                  )
              )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
