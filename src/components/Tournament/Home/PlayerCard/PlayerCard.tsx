import {
  Box,
  Card,
  CardBody,
  Grid,
  Heading,
  HStack,
  IconButton,
  Stack,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { Bold, ListItem, TableCell, TableRow } from '@tremor/react';
import { Fragment, useMemo } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import {
  MatchResult,
  Standing,
  Tournament,
} from '../../../../../types/tournament';
import { StatsHeading } from '../../../common/StatsHeading';
import { getResultItemBackgroundColor, getResultItemPrimaryColor } from '../../../DataDisplay/helpers';
import { OpponentRoundList } from '../../../DataDisplay/Standings/OpponentRoundList/OpponentRoundList';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

export type PlayerCardSize = 'sm' | 'md' | 'lg';

export interface PlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
  isDeckLoading?: boolean;
  canEditDecks?: boolean;
  onUnpinPlayer?: () => void;
  topCut?: boolean;
  shouldHideStanding?: boolean;
  size?: PlayerCardSize;
  shouldHideOpponent?: boolean;
  shouldDisableOpponentModal?: boolean;
  result?: MatchResult;
  shouldMoveResultLast?: boolean;
  isPlayerMeOrMyOpponent: boolean;
  roundNumber?: number;
}

export const inverseResult = (result?: MatchResult) =>
  !result ? undefined : result === 'W' ? 'L' : result === 'L' ? 'W' : 'T';

const ResultLetter = ({ result }: { result?: MatchResult }) => {
  return (
    <Bold className={`text-${getResultItemPrimaryColor(result)} font-black`}>{result}</Bold>
  )
};

export const PlayerCard = (props: PlayerCardProps) => {
  const { colorMode } = useColorMode();

  const isInTopCut =
    props.topCut && props.tournament.tournamentStatus === 'running';

  const isCurrentlyPlayingInTopCut =
    isInTopCut && !!props.player.currentOpponent;
  const hasLostInTopCut = isInTopCut && !props.player.currentOpponent;

  if (isCurrentlyPlayingInTopCut) {
    return (
      <HStack alignItems={'stretch'} spacing={3}>
        <Card
          backgroundColor={getResultBackgroundColor(props.result, colorMode)}
          width='100%'
        >
          <CardBody
            padding={3}
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <StandingsRow
              result={props.player}
              tournament={props.tournament}
              onUnpinPlayer={props.onUnpinPlayer}
              canEditDecks={props.canEditDecks}
              shouldHideDeck={props.shouldHideDecks}
              isDeckLoading={props.isDeckLoading}
              // If we're in top 8 and the player is knocked out, blur them out while the tournament is still running
              translucent={hasLostInTopCut}
              isCurrentlyPlayingInTopCut={isCurrentlyPlayingInTopCut}
              shouldHideStanding={props.shouldHideStanding}
              shouldDisableOpponentModal={props.shouldDisableOpponentModal}
              isPlayerMeOrMyOpponent={false}
            />
          </CardBody>
        </Card>

        {props.player.currentOpponent && !props.shouldHideOpponent && (
          <Fragment>
            <Stack justifyContent={'center'}>
              <Heading color='gray.400' fontSize={14} textTransform='uppercase'>
                vs
              </Heading>
            </Stack>
            <Card
              backgroundColor={getResultBackgroundColor(
                inverseResult(props.result),
                colorMode
              )}
              width='100%'
            >
              <CardBody
                padding={3}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <Grid
                  width='100%'
                  gridTemplateColumns={props.result ? '25px auto' : 'auto'}
                  justifyContent='center'
                >
                  {props.result && <ResultLetter result={props.result} />}
                  <StandingsRow
                    result={props.player.currentOpponent}
                    tournament={props.tournament}
                    canEditDecks={props.canEditDecks}
                    shouldHideDeck={props.shouldHideDecks}
                    isDeckLoading={props.isDeckLoading}
                    translucent={!props.topCut}
                    isCurrentlyPlayingInTopCut={isCurrentlyPlayingInTopCut}
                    isPlayerMeOrMyOpponent={false}
                  />
                </Grid>
              </CardBody>
            </Card>
          </Fragment>
        )}
      </HStack>
    );
  }
  return (
    <>
      <TableRow className={`bg-${getResultItemBackgroundColor(props.result, colorMode)}`}>
        {props.roundNumber && <TableCell><Bold className={`text-gray-500 font-black text-lg`}>{props.roundNumber}</Bold></TableCell>}
        <TableCell>{props.result && <ResultLetter result={props.result} />}</TableCell>
        <StandingsRow
          result={props.player}
          tournament={props.tournament}
          onUnpinPlayer={props.onUnpinPlayer}
          canEditDecks={props.canEditDecks}
          shouldHideDeck={props.shouldHideDecks}
          isDeckLoading={props.isDeckLoading}
          // If we're in top 8 and the player is knocked out, blur them out while the tournament is still running
          translucent={hasLostInTopCut}
          isCurrentlyPlayingInTopCut={isCurrentlyPlayingInTopCut}
          shouldHideStanding={props.shouldHideStanding}
          shouldDisableOpponentModal={props.shouldDisableOpponentModal}
          isPlayerMeOrMyOpponent={props.isPlayerMeOrMyOpponent}
        />
      </TableRow>
    </>
  );
};
