import { Standing, Tournament } from '../../../../types/tournament';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { memo, useCallback } from 'react';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';
import { ListViewerOpenButton } from '../../Deck/ListViewer/ListViewerOpenButton';
import { ifPlayerDay2 } from '../../../lib/tournament';
import { OpponentRoundList } from './OpponentRoundList/OpponentRoundList';
import { ComponentLoader } from '../../common/ComponentLoader';
import { CountryFlag } from '../../Tournament/Home/CountryFlag';
import { Flex, TableCell, Text } from '@tremor/react';
import { useDisclosure } from '@chakra-ui/react';

export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  isPlayerMeOrMyOpponent: boolean;
  canEditDecks?: boolean;
  rowExpanded?: boolean;
  opponentRoundNumber?: number;
  opponentResult?: string;
  hideArchetype?: boolean;
  shouldHideDeck?: boolean;
  onUnpinPlayer?: () => void;
  translucent?: boolean;
  isDeckLoading?: boolean;
  isCurrentlyPlayingInTopCut?: boolean;
  shouldDisableOpponentModal?: boolean;
  shouldHideStanding?: boolean;
  shouldHideName?: boolean;
  shouldReplacePlacementWithVs?: boolean;
}

export const StandingsRow = memo((props: StandingsRowProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      {!props.shouldHideStanding && !props.isCurrentlyPlayingInTopCut && (
        <TableCell>
          <Text>
            <RecordIcon
              standing={props.result}
              tournament={props.tournament as Tournament}
            />
            {props.shouldReplacePlacementWithVs
              ? 'vs'
              : props.opponentRoundNumber ??
                (props.result.placing === 9999 ? 'DQ' : props.result.placing)}
          </Text>
        </TableCell>
      )}
      {!props.shouldHideName && (
        <TableCell
          className={`${props.result.drop && props.result.drop > 0 ? 'text-red-600' : ''}`}
        >
          <Flex className='gap-4 w-fit'>
            {props.result.region && <CountryFlag size='xs' countryCode={props.result.region} />}
            <Text className={ifPlayerDay2(props.result, props.tournament) ? 'font-bold' : 'font-normal'}>
              {props.result.name}
            </Text>
          </Flex>
        </TableCell>
      )}
      <TableCell>
        <Flex className='gap-2'>
          {!props.hideArchetype && !props.isDeckLoading ? (
              <DeckInfoDisplay
                tournament={props.tournament}
                player={props.result}
                enableEdits={!!props.canEditDecks}
                shouldHideDeck={props.shouldHideDeck}
                onUnpinPlayer={props.onUnpinPlayer}
                shouldHideMenu={props.translucent}
                shouldDisableDeckExtras={props.isCurrentlyPlayingInTopCut}
                isPlayerMeOrMyOpponent={props.isPlayerMeOrMyOpponent}
              />
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
      </TableCell>
      {!props.isCurrentlyPlayingInTopCut && (
        <TableCell>
          <Record standing={props.result} />
        </TableCell>
      )}
    </>
  )

  // return (
  //   <Box
  //     onClick={onOpen}
  //     cursor={!props.shouldDisableOpponentModal ? 'pointer' : 'auto'}
  //   >
  //       {!props.isCurrentlyPlayingInTopCut && (
  //         <Stack
  //           height='100%'
  //           alignItems={'end'}
  //           justifyContent='center'
  //           padding={1}
  //           paddingRight={2}
  //         >
  //           <Record standing={props.result} />
  //         </Stack>
  //       )}
  //     </Grid>
  //     {!props.shouldDisableOpponentModal && (
  //       <OpponentRoundList
  //         player={props.result}
  //         tournament={props.tournament}
  //         modalOpen={isOpen}
  //         handleCloseModal={onClose}
  //       />
  //     )}
  //   </Box>
  // );
});

StandingsRow.displayName = 'StandingsRow';
