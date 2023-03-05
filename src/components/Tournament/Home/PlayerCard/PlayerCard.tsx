import { Card, CardBody, Heading, Stack } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

export interface PlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
  isDeckLoading?: boolean;
  canEditDecks?: boolean;
  onUnpinPlayer?: () => void;
}

export const PlayerCard = (props: PlayerCardProps) => {
  return (
    <Card>
      <CardBody paddingX={0} paddingY={2}>
        <Stack spacing={0}>
          <StandingsRow
            result={props.player}
            tournament={props.tournament}
            onUnpinPlayer={props.onUnpinPlayer}
            canEditDecks={props.canEditDecks}
            shouldHideDeck={props.shouldHideDecks}
            isDeckLoading={props.isDeckLoading}
          />
          {props.player.currentOpponent && (
            <Fragment>
              <Heading
                paddingLeft='2.65rem'
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
                translucent
              />
            </Fragment>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};
