import { GridItem, Td, Text, Tr } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo, useCallback } from 'react';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';

export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  canEditDecks: boolean;
  rowExpanded?: boolean;
  toggleRowExpanded?: () => void;
  opponentRoundNumber?: number;
  opponentResult?: string;
}

export const StandingsRow = memo((props: StandingsRowProps) => {
  const getStandingsCellResultBackgroundColor = useCallback(() => {
    if (props.opponentResult) {
      return getResultBackgroundColor(props.opponentResult);
    }

    if (props.tournament.tournamentStatus !== 'finished') {
      return getResultBackgroundColor(props.result.currentMatchResult);
    }
  }, [
    props.opponentResult,
    props.result.currentMatchResult,
    props.tournament.tournamentStatus,
  ]);

  return (
    <>
      <GridItem padding={3} paddingLeft={0} paddingRight={2}>
        <Text fontSize='sm' textAlign='right'>
          {props.opponentRoundNumber ?? props.result.placing}
        </Text>
      </GridItem>
      <GridItem
        display={'flex'}
        justifyContent='space-between'
        alignItems={'center'}
      >
        <Player
          name={props.result.name}
          profile={props.result.profile}
          rowExpanded={props.rowExpanded}
          toggleRowExpanded={props.toggleRowExpanded}
        />
        <RecordIcon
          standing={props.result}
          tournamentFinished={props.tournament.tournamentStatus === 'finished'}
        />
      </GridItem>

      <GridItem
        backgroundColor={getStandingsCellResultBackgroundColor()}
        height='100%'
        alignItems={'center'}
        display='contents'
        padding={1}
      >
        <Record
          standing={props.result}
          tournamentFinished={props.tournament.tournamentStatus === 'finished'}
        />
      </GridItem>
      <GridItem paddingLeft={2}>
        <DeckInfoDisplay
          tournament={props.tournament}
          player={props.result}
          enableEdits={props.canEditDecks}
        />
      </GridItem>
    </>
  );
});

StandingsRow.displayName = 'StandingsRow';
