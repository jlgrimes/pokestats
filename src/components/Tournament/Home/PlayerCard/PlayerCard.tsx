import {
  Box,
  Card,
  CardBody,
  Grid,
  Heading,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import {
  MatchResult,
  Standing,
  Tournament,
} from '../../../../../types/tournament';
import { StatsHeading } from '../../../common/StatsHeading';
import { getResultBackgroundColor } from '../../../DataDisplay/helpers';
import { OpponentRoundList } from '../../../DataDisplay/Standings/OpponentRoundList/OpponentRoundList';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

export interface PlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
  isDeckLoading?: boolean;
  canEditDecks?: boolean;
  onUnpinPlayer?: () => void;
  topCut?: boolean;
  shouldHideStanding?: boolean;
  shouldHideName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  shouldHideOpponent?: boolean;
  shouldDisableOpponentModal?: boolean;
  result?: MatchResult;
}

export const PlayerCard = (props: PlayerCardProps) => {
  return (
    <Grid
      width='100%'
      gridTemplateColumns={props.result ? 'auto 25px' : 'auto'}
    >
      <Card
        backgroundColor={getResultBackgroundColor(props.result)}
        width='100%'
      >
        <CardBody paddingX={0} paddingY={props.size === 'sm' ? 0 : 1}>
          <Stack spacing={0}>
            <StandingsRow
              result={props.player}
              tournament={props.tournament}
              onUnpinPlayer={props.onUnpinPlayer}
              canEditDecks={props.canEditDecks}
              shouldHideDeck={props.shouldHideDecks}
              isDeckLoading={props.isDeckLoading}
              // If we're in top 8 and the player is knocked out, blur them out while the tournament is still running
              translucent={
                props.topCut &&
                props.tournament.tournamentStatus === 'running' &&
                !props.player.currentOpponent
              }
              singleDigitPlacing={props.topCut}
              shouldHideStanding={props.shouldHideStanding}
              shouldHideName={props.shouldHideName}
              shouldDisableOpponentModal={props.shouldDisableOpponentModal}
            />
            {props.player.currentOpponent && !props.shouldHideOpponent && (
              <Fragment>
                <Heading
                  paddingLeft={`${props.topCut ? 1.6 : 2.65}rem`}
                  color='gray.400'
                  fontSize={14}
                  textTransform='uppercase'
                >
                  vs
                </Heading>
                <StandingsRow
                  result={props.player.currentOpponent}
                  tournament={props.tournament}
                  canEditDecks={props.canEditDecks}
                  shouldHideDeck={props.shouldHideDecks}
                  isDeckLoading={props.isDeckLoading}
                  translucent={!props.topCut}
                  singleDigitPlacing={props.topCut}
                />
              </Fragment>
            )}
          </Stack>
        </CardBody>
      </Card>
      {props.result && (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
          <StatsHeading
            headingProps={{
              color: getResultBackgroundColor(props.result).replace(
                '100',
                '500'
              ),
              fontSize: 'lg',
            }}
          >
            {props.result}
          </StatsHeading>
        </Box>
      )}
    </Grid>
  );
};
