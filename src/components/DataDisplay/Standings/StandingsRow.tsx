import {
  Box,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Stack,
  Td,
  Text,
  Tr,
  useDisclosure,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo, useCallback } from 'react';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';
import { ListViewerOpenButton } from '../../Deck/ListViewer/ListViewerOpenButton';
import { useSession } from 'next-auth/react';
import { ifPlayerDay2 } from '../../../lib/tournament';
import { OpponentRoundList } from './OpponentRoundList/OpponentRoundList';
import { ComponentLoader } from '../../common/ComponentLoader';

export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  canEditDecks?: boolean;
  rowExpanded?: boolean;
  opponentRoundNumber?: number;
  opponentResult?: string;
  hideArchetype?: boolean;
  shouldHideDeck?: boolean;
  onUnpinPlayer?: () => void;
  translucent?: boolean;
  isDeckLoading?: boolean;
  singleDigitPlacing?: boolean;
  shouldDisableOpponentModal?: boolean;
  shouldHideStanding?: boolean;
  shouldHideName?: boolean;
}

export const StandingsRow = memo((props: StandingsRowProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

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
    <Box
      onClick={onOpen}
      cursor={!props.shouldDisableOpponentModal ? 'pointer' : 'auto'}
    >
      <Grid
        gridTemplateColumns={`${
          props.shouldHideStanding
            ? ''
            : `${props.singleDigitPlacing ? 1.6 : 2.65}rem`
        } ${!props.shouldHideName ? '2.5fr' : ''} ${
          props.hideArchetype ? 2 : 7
        }rem 1fr`}
        paddingRight={1}
        alignItems='center'
        textColor={props.translucent ? 'gray.400' : 'auto'}
      >
        {!props.shouldHideStanding && (
          <GridItem paddingLeft={0} paddingRight={2}>
            <Text
              fontSize={props.result.placing >= 1000 ? 'sm' : '0.95rem'}
              fontFamily={'mono'}
              textAlign='right'
            >
              {props.opponentRoundNumber ??
                (props.result.placing === 9999 ? 'DQ' : props.result.placing)}
            </Text>
          </GridItem>
        )}
        {!props.shouldHideName && (
          <GridItem
            display={'flex'}
            alignItems={'center'}
            color={
              props.result.drop && props.result.drop > 0 ? 'red.600' : 'auto'
            }
            fontWeight={
              ifPlayerDay2(props.result, props.tournament) ? 'bold' : 'normal'
            }
            paddingLeft={props.shouldHideStanding ? 2 : 0}
          >
            <RecordIcon
              standing={props.result}
              tournament={props.tournament as Tournament}
            />
            <Player name={props.result.name} />
          </GridItem>
        )}

        <GridItem paddingLeft={2}>
          <Flex justifyContent={'center'}>
            {!props.hideArchetype && !props.isDeckLoading ? (
              <Box opacity={props.translucent ? 0.4 : 1}>
                <DeckInfoDisplay
                  tournament={props.tournament}
                  player={props.result}
                  enableEdits={!!props.canEditDecks}
                  shouldHideDeck={props.shouldHideDeck}
                  onUnpinPlayer={props.onUnpinPlayer}
                  shouldHideMenu={props.translucent}
                />
              </Box>
            ) : (
              <ComponentLoader />
            )}
            {props.hideArchetype && props.result.deck?.list && (
              <ListViewerOpenButton
                result={props.result}
                tournament={props.tournament}
              />
            )}
          </Flex>
        </GridItem>
        <Stack
          backgroundColor={getStandingsCellResultBackgroundColor()}
          height='100%'
          alignItems={'end'}
          justifyContent='center'
          padding={1}
          paddingRight={2}
        >
          <Record standing={props.result} />
        </Stack>
      </Grid>
      {!props.shouldDisableOpponentModal && (
        <OpponentRoundList
          player={props.result}
          tournament={props.tournament}
          modalOpen={isOpen}
          handleCloseModal={onClose}
        />
      )}
    </Box>
  );
});

StandingsRow.displayName = 'StandingsRow';
