import { Grid, GridItem, Stack, Td, Text, Tr } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo, useCallback } from 'react';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';
import { ListViewerOpenButton } from '../../Deck/ListViewer/ListViewerOpenButton';

export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  canEditDecks?: boolean;
  rowExpanded?: boolean;
  toggleRowExpanded?: () => void;
  opponentRoundNumber?: number;
  opponentResult?: string;
  hideArchetype?: boolean;
  shouldHideDeck?: boolean;
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
      <GridItem padding={2} paddingLeft={0} paddingRight={2}>
        <Text fontSize={'sm'} fontFamily='monospace' textAlign='right'>
          {props.opponentRoundNumber ??
            (props.result.placing === 9999 ? 'DQ' : props.result.placing)}
        </Text>
      </GridItem>
      <GridItem
        display={'flex'}
        alignItems={'center'}
        color={props.result.drop ? 'red.600' : 'auto'}
        fontWeight={props.result.day2 ? 'bold' : 'normal'}
      >
        <RecordIcon
          standing={props.result}
          tournamentFinished={props.tournament.tournamentStatus === 'finished'}
        />
        <Player
          name={props.result.name}
          toggleRowExpanded={props.toggleRowExpanded}
        />
      </GridItem>

      <Stack
        backgroundColor={getStandingsCellResultBackgroundColor()}
        height='100%'
        alignItems={'end'}
        justifyContent='center'
        padding={1}
      >
        <Record standing={props.result} />
      </Stack>
      <GridItem paddingLeft={2}>
        {!props.hideArchetype && (
          <DeckInfoDisplay
            tournament={props.tournament}
            player={props.result}
            enableEdits={!!props.canEditDecks}
            shouldHideDeck={props.shouldHideDeck}
          />
        )}
        {props.hideArchetype && props.result.deck?.list && (
          <ListViewerOpenButton
            result={props.result}
            tournament={props.tournament}
          />
        )}
      </GridItem>
    </>
  );
});

StandingsRow.displayName = 'StandingsRow';
