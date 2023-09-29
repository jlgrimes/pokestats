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
import {
  getResultItemBackgroundColor,
  getResultItemPrimaryColor,
} from '../../../DataDisplay/helpers';
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
    <Bold className={`text-${getResultItemPrimaryColor(result)} font-black`}>
      {result}
    </Bold>
  );
};

export const PlayerCard = (props: PlayerCardProps) => {
  console.log(props.player)
  const { colorMode } = useColorMode();

  const isInTopCut =
    props.topCut && props.tournament.tournamentStatus === 'running';

  const isCurrentlyPlayingInTopCut =
    isInTopCut && !!props.player.currentOpponent;
  const hasLostInTopCut = isInTopCut && !props.player.currentOpponent;

  return (
    <>
      <TableRow
        className={`bg-${getResultItemBackgroundColor(
          props.result,
          colorMode
        )}`}
      >
        {props.roundNumber && (
          <TableCell className='px-2' width={16}>
            <Bold className={`text-gray-500 font-black text-lg text-right`}>
              {props.roundNumber}
            </Bold>
          </TableCell>
        )}
        <TableCell width={48} className='pr-0'>
          {props.result && <ResultLetter result={props.result} />}
        </TableCell>
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
