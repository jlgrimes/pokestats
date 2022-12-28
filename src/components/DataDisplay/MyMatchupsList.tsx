import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { MatchupResult } from '../../../types/tournament';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import SpriteDisplay from '../common/SpriteDisplay';
import DeckInput from '../Deck/DeckInput/DeckInput';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { ListViewerOpenButton } from '../Deck/ListViewer/ListViewerOpenButton';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from './helpers';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';

export const MyMatchupsList = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const session = useSession();
  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: true },
  });
  const player = useMemo(
    () =>
      liveResults?.data?.find(
        player => player.name === session.data?.user.name
      ),
    [liveResults?.data, session.data?.user.name]
  );

  const opponents: (MatchupResult | undefined)[] = useMemo(
    () =>
      Object.values(player?.rounds ?? {})?.map(opponent => {
        const opponentResult = liveResults?.data.find(
          player => player.name === opponent.name
        );

        if (opponentResult) {
          return {
            ...opponentResult,
            result: opponent.result,
          };
        }

        return;
      }),
    [liveResults?.data, player?.rounds]
  );
  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th></Th>
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
          {opponents.map(
            (opponent, idx) =>
              opponent && (
                <Tr height='41px' key={idx}>
                  <Td
                    padding={0}
                    backgroundColor={getResultBackgroundColor(opponent.result)}
                    textAlign='center'
                  >
                    {opponent.result}
                  </Td>
                  <Td
                    maxWidth={'12rem'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    padding={0}
                    paddingLeft={2}
                  >
                    <Player
                      name={opponent.name}
                      profile={opponent.profile}
                      isEditable={false}
                    />
                  </Td>

                  <Td padding={0}>{formatRecord(opponent.record)}</Td>
                  <Td padding={0}>
                    <DeckInfoDisplay
                      tournament={tournament}
                      player={opponent}
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