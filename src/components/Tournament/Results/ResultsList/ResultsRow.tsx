import { Td, Tr } from '@chakra-ui/react';
import { useCallback } from 'react';
import SpriteDisplay from '../../../common/SpriteDisplay';
import DeckInput from './DeckInput/DeckInput';
import { formatRecord } from './helpers';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';
import { Player } from './Player/Player';

export const ResultsRow = ({
  result,
  tournament,
  allowEdits,
  tournamentFinished,
  view,
}: {
  result: Record<string, any>;
  tournament: { id: string; name: string };
  allowEdits: boolean;
  tournamentFinished: boolean;
  view: 'profile' | 'standings' | 'matchups';
}) => {
  const getResultBackgroundColor = useCallback(
    (matchResult: string) => {
      if (tournamentFinished) {
        return '';
      }

      return matchResult === 'W'
        ? 'green.100'
        : matchResult === 'T'
        ? 'yellow.100'
        : matchResult === 'L'
        ? 'red.100'
        : '';
    },
    [tournamentFinished]
  );

  return (
    <Tr height='41px'>
      {view === 'profile' && <Td padding={2}>{tournament.name}</Td>}
      <Td isNumeric={view === 'standings'} padding={0}>
        {result.placing}
      </Td>
      {(view === 'standings' || view === 'matchups') && (
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
      )}

      <Td
        padding={0}
        backgroundColor={getResultBackgroundColor(result.currentMatchResult)}
      >
        {formatRecord(result.record)}
      </Td>
      <Td padding={0} paddingLeft={2}>
        {allowEdits && !result?.deck?.list ? (
          <DeckInput
            tournamentId={tournament.id}
            playerName={result.name}
            deckName={result.deck?.name}
          />
        ) : (
          <SpriteDisplay pokemonNames={result?.deck?.defined_pokemon ?? []} />
        )}
      </Td>
      {result.deck.list && (
        <Td padding={0}>
          <ListViewerOpenButton result={result} />
        </Td>
      )}
    </Tr>
  );
};
