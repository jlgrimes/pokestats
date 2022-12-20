import {
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';
import SpriteDisplay from '../../../common/SpriteDisplay';
import DeckInput from './DeckInput/DeckInput';
import { formatRecord } from './helpers';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';
import { Player } from './Player/Player';

interface LiveResultType {
  placing: string;
  name: string;
  profile: { id: number; twitterUrl: string };
  record: { wins: number; losses: number; ties: number };
  deck: { name: string; defined_pokemon: string[]; list: Record<string, any> };
  currentMatchResult: string;
}

export default function ResultsList({
  liveResults,
  tournament,
  allowEdits,
}: {
  liveResults: LiveResultType[];
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
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
          {liveResults?.map((result: LiveResultType, idx: number) => {
            return (
              <Tr key={idx} height='41px'>
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
                    isEditable={allowEdits}
                  />
                </Td>
                <Td
                  padding={0}
                  backgroundColor={
                    result.currentMatchResult === 'W'
                      ? 'green.100'
                      : result.currentMatchResult === 'T'
                      ? 'yellow.100'
                      : result.currentMatchResult === 'L'
                      ? 'red.100'
                      : ''
                  }
                >
                  {formatRecord(result.record)}
                </Td>
                <Td padding={0} paddingLeft={2}>
                  {allowEdits ? (
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
                <Td padding={0}>
                  {result.deck.list && (
                    <ListViewerOpenButton result={result} />
                  )}
                </Td>
                {/* <Td>
                <SpriteAndNameDisplay
                  archetypeName={result.deck_archetype}
                  pokemonNames={
                    decks?.find(deck => deck.name === result.deck_archetype)
                      ?.defined_pokemon ?? []
                  }
                />
              </Td> */}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
