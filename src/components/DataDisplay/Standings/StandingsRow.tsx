import { Td, Tr } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo } from 'react';

export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  canEditDecks: boolean;
  rowExpanded?: boolean;
  toggleRowExpanded?: () => void;
}

export const StandingsRow = memo((props: StandingsRowProps) => {
  return (
    <Tr height='41px'>
      <Td isNumeric padding={0}>
        {props.result.placing}
      </Td>
      <Td
        maxWidth={'12rem'}
        overflow={'hidden'}
        textOverflow={'ellipsis'}
        padding={0}
        paddingLeft={2}
      >
        <Player
          name={props.result.name}
          profile={props.result.profile}
          rowExpanded={props.rowExpanded}
          toggleRowExpanded={props.toggleRowExpanded}
        />
      </Td>

      <Td
        padding={0}
        backgroundColor={
          props.tournament.tournamentStatus !== 'finished'
            ? getResultBackgroundColor(props.result.currentMatchResult)
            : ''
        }
      >
        <Record standing={props.result} />
      </Td>
      <Td padding={0} paddingLeft={4}>
        <DeckInfoDisplay
          tournament={props.tournament}
          player={props.result}
          enableEdits={props.canEditDecks}
        />
      </Td>
    </Tr>
  );
});

StandingsRow.displayName = 'StandingsRow';
