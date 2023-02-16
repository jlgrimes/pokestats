import { Card, CardBody } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

interface PinnedPlayerCardProps {
  player: Standing;
  tournament: Tournament;
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  return (
    <Card>
      <CardBody paddingX={0}>
        <StandingsRow result={props.player} tournament={props.tournament} />
      </CardBody>
    </Card>
  );
};
