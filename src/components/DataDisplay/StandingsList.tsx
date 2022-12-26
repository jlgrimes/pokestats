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
import { Standing } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import SpriteDisplay from '../common/SpriteDisplay';
import DeckInput from '../Tournament/Results/ResultsList/DeckInput/DeckInput';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { ListViewerOpenButton } from '../Tournament/Results/ResultsList/ListViewer/ListViewerOpenButton';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from './helpers';

export const StandingsList = ({
  results,
  tournament,
  tournamentFinished,
}: {
  results: Standing[];
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) => {
  const userIsAdmin = useUserIsAdmin();

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
          {results.map((result: Standing, idx: number) => (
            <Tr height='41px' key={idx}>
              <Td isNumeric padding={0}>
                {result.placing}
              </Td>
              <Td
                maxWidth={'12rem'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                padding={0}
                paddingLeft={2}
              >
                <Player
                  name={result.name}
                  profile={result.profile}
                  isEditable={userIsAdmin}
                />
              </Td>

              <Td
                padding={0}
                backgroundColor={
                  !tournamentFinished
                    ? getResultBackgroundColor(result.currentMatchResult)
                    : ''
                }
              >
                {formatRecord(result.record)}
              </Td>
              <Td padding={0} paddingLeft={2}>
                {userIsAdmin && !result?.deck?.list ? (
                  <DeckInput
                    tournamentId={tournament.id}
                    playerName={result.name}
                    deckName={result.deck?.name}
                  />
                ) : (
                  <SpriteDisplay
                    pokemonNames={result?.deck?.defined_pokemon ?? []}
                  />
                )}
              </Td>
              {result.deck.list && (
                <Td padding={0}>
                  <ListViewerOpenButton result={result} />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
