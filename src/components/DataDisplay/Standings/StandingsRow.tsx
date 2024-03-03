import { Standing, Tournament } from '../../../../types/tournament';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { PropsWithChildren, memo, useCallback } from 'react';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';
import { ListViewerOpenButton } from '../../Deck/ListViewer/ListViewerOpenButton';
import { ifPlayerDay2 } from '../../../lib/tournament';
import { OpponentRoundList } from './OpponentRoundList/OpponentRoundList';
import { ComponentLoader } from '../../common/ComponentLoader';
import { CountryFlag } from '../../Tournament/Home/CountryFlag';
import { Bold, Flex, Icon, Text } from '@tremor/react';
import { useDisclosure } from '@chakra-ui/react';
import { MatchPoints } from '../../Tournament/Results/ResultsList/MatchPoints';
import { FaRunning } from 'react-icons/fa';
import { trackEvent } from '../../../lib/track';

interface StandingsCellProps extends PropsWithChildren {
  className?: string;
  width?: number;
  onClick?: (e: any) => void
}

export const StandingsCell = (props: StandingsCellProps) => {
  const {
    children,
    className,
    ...rest
  } = props;

  return <td {...rest} className={'align-middle ' + className ?? ''}>{props.children}</td>;
}


export interface StandingsRowProps {
  result: Standing;
  tournament: Tournament;
  canEditDecks?: boolean;
  rowExpanded?: boolean;
  opponentRoundNumber?: number;
  opponentResult?: string;
  hideArchetype?: boolean;
  onUnpinPlayer?: () => void;
  translucent?: boolean;
  isDeckLoading?: boolean;
  isCurrentlyPlayingInTopCut?: boolean;
  shouldDisableOpponentModal?: boolean;
  shouldHideStanding?: boolean;
  shouldHideList?: boolean;
  shouldHideRegion?: boolean;
  shouldHideResistance?: boolean;
  shouldShowMatchPoints?: boolean;
  isMe?: boolean;
}

export const StandingsRow = memo((props: StandingsRowProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const shouldShowResistance = !props.isCurrentlyPlayingInTopCut && props.result.resistances?.opp && !props.shouldHideResistance;

  return (
    <>
      {!props.shouldHideStanding && !props.isCurrentlyPlayingInTopCut && (
        <StandingsCell className='w-8'>
          <Text className='text-right mr-2'>
            {/* <RecordIcon
              standing={props.result}
              tournament={props.tournament as Tournament}
            /> */}
            {props.opponentRoundNumber ??
                (props.result.placing === 9999 ? 'DQ' : props.result.placing)}
          </Text>
        </StandingsCell>
      )}
      {!props.shouldHideRegion && (
        <StandingsCell width={40}>
          {props.result.region && <CountryFlag size='xs' countryCode={props.result.region} />}
        </StandingsCell>
      )}
      <StandingsCell
        className={`align-middle whitespace-normal break-normal ${props.result.drop && props.result.drop > 0 ? 'text-red-600' : ''} ${!props.shouldDisableOpponentModal ? 'cursor-pointer' : ''}`}
        onClick={() => {
          trackEvent('Opponent round modal opened', { isMe: props.isMe });
          onOpen();
        }}
      >
        <Flex>
          <Text className={`${ifPlayerDay2(props.result, props.tournament) ? 'font-bold' : 'font-normal'}`}>
            {props.result.name}
          </Text>
          {props.result.drop && props.result.drop > 0 && <Icon icon={FaRunning} color='red' />}
        </Flex>
      </StandingsCell>
      <StandingsCell width={props.shouldHideList ? 80 : 126}>
        <Flex className='gap-2'>
          {!props.hideArchetype && !props.isDeckLoading ? (
              <DeckInfoDisplay
                tournament={props.tournament}
                player={props.result}
                enableEdits={!!props.canEditDecks}
                onUnpinPlayer={props.onUnpinPlayer}
                shouldHideMenu={props.translucent}
                shouldDisableDeckExtras={props.isCurrentlyPlayingInTopCut}
                disableList={props.shouldHideList}
                isMe={props.isMe}
              />
            ) : (
              <ComponentLoader />
            )}
            {props.hideArchetype && props.result.decklist && (
              <ListViewerOpenButton
                result={props.result}
                tournament={props.tournament}
              />
            )}
        </Flex>
      </StandingsCell>
      {!props.isCurrentlyPlayingInTopCut && (
        <StandingsCell className={`text-right w-16 ${!shouldShowResistance ? 'pr-2' : ''}`}>
          {props.shouldShowMatchPoints ? (
            <MatchPoints standing={props.result} />
          ) : (
            <Record standing={props.result} />
          )}
        </StandingsCell>
      )}
      {shouldShowResistance && (
        <StandingsCell width={40} className='text-right pr-1'>
          <Bold className={'text-slate-400 text-sm'}>{(props.result.resistances!.opp * 100).toPrecision(3)}</Bold>
        </StandingsCell>
      )}
      {!props.shouldDisableOpponentModal && (
        <OpponentRoundList
          player={props.result}
          tournament={props.tournament}
          modalOpen={isOpen}
          handleCloseModal={onClose}
        />
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
