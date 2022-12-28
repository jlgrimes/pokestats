import { Td, Tr, Link } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { MatchupResult } from '../../../../../types/tournament';
import SpriteDisplay from '../../../common/SpriteDisplay';
import DeckInput from '../../../Deck/DeckInput/DeckInput';
import { formatRecord } from './helpers';
import { ListViewerOpenButton } from '../../../Deck/ListViewer/ListViewerOpenButton';
import { Player } from './Player/Player';

export const ResultsRow = ({
  result,
  tournament,
  allowEdits,
  tournamentFinished,
  view,
}: {
  result: MatchupResult;
  tournament: { id: string; name: string };
  allowEdits: {
    player: boolean;
    deck: boolean;
  };
  tournamentFinished: boolean;
  view: 'profile' | 'standings' | 'matchups';
}) => {
  const getResultBackgroundColor = useCallback(
    (matchResult: string | undefined) => {
      return matchResult === 'W'
        ? 'green.100'
        : matchResult === 'T'
        ? 'yellow.100'
        : matchResult === 'L'
        ? 'red.100'
        : '';
    },
    []
  );
  const session = useSession();

  return (
    <Tr height='41px'>
      {view === 'profile' && (
        <Td padding={2}>
          <Link
            as={NextLink}
            color='blue.500'
            href={`${tournament.id}/my-results`}
          >
            {tournament.name}
          </Link>
        </Td>
      )}
      {(view === 'standings' || view === 'profile') && (
        <Td isNumeric={view === 'standings'} padding={0}>
          {result.placing}
        </Td>
      )}
      {view === 'matchups' && (
        <Td
          padding={0}
          backgroundColor={getResultBackgroundColor(result.result)}
          textAlign='center'
        >
          {result.result}
        </Td>
      )}
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
            isEditable={allowEdits.player}
          />
        </Td>
      )}

      <Td
        padding={0}
        backgroundColor={
          tournamentFinished
            ? getResultBackgroundColor(result.currentMatchResult)
            : ''
        }
      >
        {formatRecord(result.record)}
      </Td>
      <Td padding={0} paddingLeft={2}>
        {allowEdits && !result?.deck?.list ? (
          <DeckInput
            tournamentId={tournament.id}
            playerName={result.name}
            deckName={result.deck?.name}
            quickEdit={true}
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
