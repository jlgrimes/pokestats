import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  Th,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo } from 'react';

export const StandingsRow = memo(
  ({
    result,
    tournament,
    canExpandRow,
    canEditDecks
  }: {
    result: Standing;
    tournament: Tournament;
    canExpandRow: boolean;
    canEditDecks: boolean;
  }) => {
    return (
      <Tr height='41px'>
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
            isExpandable={canExpandRow}
          />
        </Td>

        <Td
          padding={0}
          backgroundColor={
            tournament.tournamentStatus !== 'finished'
              ? getResultBackgroundColor(result.currentMatchResult)
              : ''
          }
        >
          <Record standing={result} />
        </Td>
        <Td padding={0} paddingLeft={4}>
          <DeckInfoDisplay
            tournament={tournament}
            player={result}
            enableEdits={canEditDecks}
          />
        </Td>
      </Tr>
    );
  }
);

StandingsRow.displayName = 'StandingsRow';
